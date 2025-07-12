const Expense = require("../model/ExpenseModel");
const Category = require("../model/CategoryModel");
const Budget = require('../model/BudgetModel')
const mongoose = require("mongoose");

class ExpenseController {
  //  Create a new expense
  async create(req, res) {
    try {
      const userId = req.user._id;
      const { amount, category, date, note, type } = req.body;

      if (!amount || !category || !date || !type) {
        return res.status(400).json({
          status: false,
          message: "Amount, type, category, and date are required.",
        });
      }

      // 1. Ensure income exists
      const totalIncome = await Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            type: "income",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      if (
        type === "expense" &&
        (totalIncome.length === 0 || totalIncome[0].total === 0)
      ) {
        return res.status(400).json({
          status: false,
          message: "Please add income first before creating expenses.",
        });
      }

      // 2. Validate budget
      let activeBudget;
      const expenseDate = new Date(date);

      if (type === "expense") {
        activeBudget = await Budget.findOne({
          user: userId,
          category: category,
          startDate: { $lte: expenseDate },
          endDate: { $gte: expenseDate },
        });

        if (!activeBudget) {
          return res.status(400).json({
            status: false,
            message:
              "Set a budget for this category and date before creating an expense.",
          });
        }

        // 3. Prevent overspending (optional)
        const projectedSpent = activeBudget.spentAmount + Number(amount);
        if (projectedSpent > activeBudget.amount) {
          return res.status(400).json({
            status: false,
            message: "This expense exceeds your set budget limit.",
          });
        }
      }

      // 4. Save the expense
      const expense = new Expense({
        user: userId,
        amount,
        category,
        date,
        note,
        type,
      });

      const savedExpense = await expense.save();

      // 5. Update budget's spentAmount
      if (type === "expense" && activeBudget) {
        activeBudget.spentAmount += Number(amount);
        await activeBudget.save();
      }

      return res.status(201).json({
        status: true,
        message: "Expense recorded successfully.",
        data: savedExpense,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  //  Get all expenses (for current user)
  async getAll(req, res) {
    try {
      const expenses = await Expense.find({ user: req.user._id })
        .populate("category")
        .sort({ date: -1 });

      return res.status(200).json({
        status: true,
        message: "Expenses fetched successfully.",
        total: expenses.length,
        data: expenses,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  // 🔍 Get expense by ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const expense = await Expense.findOne({
        _id: id,
        user: req.user._id,
      }).populate("category");

      if (!expense) {
        return res.status(404).json({
          status: false,
          message: "Expense not found.",
        });
      }

      return res.status(200).json({
        status: true,
        data: expense,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  //  Update an expense
  async update(req, res) {
    try {
      const { id } = req.params;
      const { amount, category, date, note, type } = req.body;

      // 1. Find the original expense
      const expense = await Expense.findOne({ _id: id, user: req.user._id });

      if (!expense) {
        return res.status(404).json({
          status: false,
          message: "Expense not found or unauthorized.",
        });
      }

      // 2. If it's an expense type, handle budget logic
      if (type === "expense") {
        const newDate = new Date(date);
        const newAmount = Number(amount);

        // 2.1. Find previous budget (based on old category and date)
        const prevBudget = await Budget.findOne({
          user: req.user._id,
          category: expense.category,
          startDate: { $lte: expense.date },
          endDate: { $gte: expense.date },
        });

        // 2.2. Subtract the old expense from previous budget
        if (prevBudget) {
          prevBudget.spentAmount -= expense.amount;
          await prevBudget.save();
        }

        // 2.3. Find the updated budget
        const newBudget = await Budget.findOne({
          user: req.user._id,
          category: category,
          startDate: { $lte: newDate },
          endDate: { $gte: newDate },
        });

        if (!newBudget) {
          return res.status(400).json({
            status: false,
            message: "No budget found for the updated category/date.",
          });
        }

        // 2.4. Check if new expense exceeds budget
        const projected = newBudget.spentAmount + newAmount;
        if (projected > newBudget.amount) {
          return res.status(400).json({
            status: false,
            message: "This updated expense exceeds your budget limit.",
          });
        }

        // 2.5. Add updated amount to new budget
        newBudget.spentAmount += newAmount;
        await newBudget.save();
      }

      // 3. Update the expense
      const updated = await Expense.findByIdAndUpdate(
        id,
        { amount, category, date, note, type },
        { new: true }
      );

      return res.status(200).json({
        status: true,
        message: "Expense updated successfully.",
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  //  Delete an expense
  async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Expense.findOneAndDelete({
        _id: id,
        user: req.user._id,
      });

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: "Expense not found or unauthorized.",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Expense deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
  //filter Expenses
  async filterExpenses(req, res) {
  try {
    const userId = req.user._id;
    const { startDate, endDate, category, minAmount, maxAmount, type } = req.query;

    const filter = { user: userId };

    // ✅ Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // ✅ Category filter
    if (category) {
      filter.category = category; // must be category _id
    }

    // ✅ Amount range filter
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }

    // ✅ Type filter (e.g., income or expense)
    if (type) {
      filter.type = type;
    }

    const expenses = await Expense.find(filter)
      .populate("category")
      .sort({ date: -1 });

    return res.status(200).json({
      status: true,
      message: "Filtered expenses fetched successfully.",
      total: expenses.length,
      data: expenses,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}

}

module.exports = new ExpenseController();
