const User = require("../model/UserModel");
const Expense = require("../model/ExpenseModel");
const postModel = require("../model/Posts");
const BlogCategoryModel = require("../model/BlogCategory");
const fs = require("fs");

class AdminStatsController {
  //Render Admin Dashboard
  async dashboardView(req, res) {
    try {
      const totalUsers = await User.countDocuments({ role: "user" });

      const expenseResult = await Expense.aggregate([
        { $match: { type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const totalExpense = expenseResult[0]?.total || 0;

      const incomeResult = await Expense.aggregate([
        { $match: { type: "income" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const totalIncome = incomeResult[0]?.total || 0;

      // Per-user stats (for table)
      const userStats = await User.aggregate([
        { $match: { role: "user" } },
        {
          $lookup: {
            from: "expenses",
            localField: "_id",
            foreignField: "user",
            as: "expenses",
          },
        },
        {
          $project: {
            userId: "$_id",
            name: 1,
            email: 1,
            totalExpense: {
              $sum: {
                $map: {
                  input: "$expenses",
                  as: "exp",
                  in: {
                    $cond: [
                      { $eq: ["$$exp.type", "expense"] },
                      "$$exp.amount",
                      0,
                    ],
                  },
                },
              },
            },
            totalIncome: {
              $sum: {
                $map: {
                  input: "$expenses",
                  as: "exp",
                  in: {
                    $cond: [
                      { $eq: ["$$exp.type", "income"] },
                      "$$exp.amount",
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
      ]);

      res.render("adminHome", {
        user: req.user,
        totalUsers,
        totalExpense,
        totalIncome,
        userStats,
        message: req.flash("message")[0],
        error: req.flash("error")[0],
      });
    } catch (error) {
      req.flash("error", "Error loading dashboard: " + error.message);
      return res.redirect("/admin-dashboard");
    }
  }

  async userDetailsView(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user || user.role !== "user") {
        req.flash("error", "User not found or invalid.");
        return res.redirect("/admin-dashboard");
      }

      const income = await Expense.aggregate([
        { $match: { user: user._id, type: "income" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const expense = await Expense.aggregate([
        { $match: { user: user._id, type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const totalIncome = income[0]?.total || 0;
      const totalExpense = expense[0]?.total || 0;

      res.render("userDetails", {
        user,
        totalIncome,
        totalExpense,
        message: req.flash("message")[0],
        error: req.flash("error")[0],
      });
    } catch (error) {
      req.flash("error", "Error loading user details: " + error.message);
      return res.redirect("/admin-dashboard");
    }
  }

  async getDashboardStats(req, res) {
    try {
      const totalPosts = await postModel.countDocuments();
      const totalCategories = await BlogCategoryModel.countDocuments();
      const uniqueAuthors = await postModel.distinct("author");
      const totalAuthors = uniqueAuthors.length;
      const posts = await postModel
        .find()
        .populate("categoryId", "name")
        .populate("author", "name");

      return res.render("blogTable", {
        user: req.user,
        totalPosts,
        totalCategories,
        totalAuthors,
        posts,
        message: req.flash("message")[0],
        error: req.flash("error")[0],
      });
    } catch (error) {
      req.flash("error", "Error loading dashboard: " + error.message);
      return res.redirect("/admin-dashboard");
    }
  }
  async getBlogPostById(req, res) {
    try {
      const message = req.flash("message")[0];
      const error = req.flash("error")[0];
      const id = req.params.id;
      const data = await postModel
        .findById(id)
        .populate("categoryId", "name")
        .populate("author", "name");
      res.render("blogDetails", {
        user: req.user,
        data: data,
        message,
        error,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async deletePostById(req, res) {
    try {
      const id = req.params.id;
      const data = await postModel.findById;

      if (data.image) {
        fs.unlink(data.image, () => {
          if (err) {
            console.log("Error deleteing image.");
          } else {
            console.log("Image deleted successfully.");
          }
        });
      }
      await postModel.findByIdAndDelete(id);
      req.flash("Post deleted successfully");
      return res.redirect("/admin/get-blog-stats");
    } catch (error) {
      req.flash(error.message);
      return res.redirect("/admin/get-blog-stats");
    }
  }
}

module.exports = new AdminStatsController();
