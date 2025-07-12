const Expense = require("../model/ExpenseModel");
const mongoose = require("mongoose");

class DashboardController {
  async getSummary(req, res) {
    try {
      const userId = req.user._id;

      const expenses = await Expense.find({ user: userId });

      let totalIncome = 0;
      let totalExpense = 0;

      for (const tx of expenses) {
        if (tx.type === "income") {
          totalIncome += tx.amount;
        } else {
          totalExpense += tx.amount;
        }
      }

      const remaining = totalIncome - totalExpense;

      // 2. Group spending by category (only for expenses)
      const categorySpend = await Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            type: "expense",
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: "$categoryInfo" },
        {
          $project: {
            category: "$categoryInfo.name",
            amount: "$total",
          },
        },
      ]);

      return res.status(200).json({
        status: true,
        summary: {
          totalIncome,
          totalExpense,
          remaining,
          categorySpend,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

module.exports = new DashboardController();
