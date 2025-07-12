const mongoose = require("mongoose");
const Budget = require("../model/BudgetModel");
const Category = require("../model/CategoryModel");
const Expense = require("../model/ExpenseModel");

class BudgetController {
  //  Create a new budget
  async create(req, res) {
    try {
      const userId = req.user._id;
      const { category, amount, startDate, endDate } = req.body;

      // ✅ Basic validations
      if (!category || !amount || !startDate || !endDate) {
        return res.status(400).json({
          status: false,
          message:
            "All fields (category, amount, startDate, endDate) are required.",
        });
      }

      if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({
          status: false,
          message: "Start date must be before end date.",
        });
      }

      // ✅ Check if category exists and is of type 'expense'
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({
          status: false,
          message: "Invalid category.",
        });
      }

      if (categoryDoc.type !== "expense") {
        return res.status(400).json({
          status: false,
          message: "Budgets can only be created for expense categories.",
        });
      }

      // ✅ Check for overlapping budgets
      const overlap = await Budget.findOne({
        user: userId,
        category,
        $or: [
          {
            startDate: { $lte: endDate },
            endDate: { $gte: startDate },
          },
        ],
      });

      if (overlap) {
        return res.status(400).json({
          status: false,
          message: "Budget for this category overlaps with an existing one.",
        });
      }

      // ✅ Get total income for user
      const incomeAgg = await Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            type: "income",
          },
        },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: "$amount" },
          },
        },
      ]);

      const totalIncome = incomeAgg[0]?.totalIncome || 0;

      // ✅ Get total existing budgets
      const existingBudgets = await Budget.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: null,
            totalBudgeted: { $sum: "$amount" },
          },
        },
      ]);

      const totalBudgeted = existingBudgets[0]?.totalBudgeted || 0;

      // ✅ Prevent budget from exceeding total income
      if (totalBudgeted + Number(amount) > totalIncome) {
        return res.status(400).json({
          status: false,
          message: "This budget exceeds your total income.",
        });
      }

      // ✅ Create and save budget
      const budget = new Budget({
        user: userId,
        category,
        amount,
        startDate,
        endDate,
      });

      const saved = await budget.save();

      return res.status(201).json({
        status: true,
        message: "Budget created successfully.",
        data: saved,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }

  //  Get all budgets of current user
  async getAll(req, res) {
    try {
      const userId = req.user._id;

      const budgets = await Budget.find({ user: userId })
        .populate("category")
        .sort({ startDate: -1 });

      return res.status(200).json({
        status: true,
        message: "Budgets fetched successfully.",
        total: budgets.length,
        data: budgets,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
  //get bidget by id
  async getById(req, res) {
    try {
      const { id } = req.params;

      const budget = await Budget.findOne({
        _id: id,
        user: req.user._id,
      }).populate("category");

      if (!budget) {
        return res.status(404).json({
          status: false,
          message: "Budget not found.",
        });
      }

      return res.status(200).json({
        status: true,
        data: budget,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
  //  Update a budget
  async update(req, res) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const { category, amount, startDate, endDate } = req.body;

      const existing = await Budget.findOne({ _id: id, user: userId });
      if (!existing) {
        return res.status(404).json({
          status: false,
          message: "Budget not found or unauthorized.",
        });
      }

      // Check overlap again (excluding current budget)
      const overlap = await Budget.findOne({
        _id: { $ne: id },
        user: userId,
        category,
        $or: [
          {
            startDate: { $lte: endDate },
            endDate: { $gte: startDate },
          },
        ],
      });

      if (overlap) {
        return res.status(400).json({
          status: false,
          message: "Budget overlaps with another existing budget.",
        });
      }

      const updated = await Budget.findByIdAndUpdate(
        id,
        { category, amount, startDate, endDate },
        { new: true }
      );

      return res.status(200).json({
        status: true,
        message: "Budget updated successfully.",
        data: updated,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }

  //  Delete budget
  async delete(req, res) {
    try {
      const { id } = req.params;

      const budget = await Budget.findOneAndDelete({
        _id: id,
        user: req.user._id,
      });

      if (!budget) {
        return res.status(404).json({
          status: false,
          message: "Budget not found or unauthorized.",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Budget deleted successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }

  // Get budget vs income summary
  async getBudgetSummary(req, res) {
    try {
      const userId = req.user._id;

      // Get total income
      const incomeAgg = await Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            type: "income",
          },
        },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: "$amount" },
          },
        },
      ]);

      const totalIncome = incomeAgg[0]?.totalIncome || 0;

      // Get total budgeted amount
      const budgetAgg = await Budget.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: null,
            totalBudgeted: { $sum: "$amount" },
          },
        },
      ]);

      const totalBudgeted = budgetAgg[0]?.totalBudgeted || 0;

      // Return the summary
      return res.status(200).json({
        status: true,
        message: "Budget summary fetched successfully.",
        data: {
          totalIncome,
          totalBudgeted,
          remaining: totalIncome - totalBudgeted,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
}

module.exports = new BudgetController();
