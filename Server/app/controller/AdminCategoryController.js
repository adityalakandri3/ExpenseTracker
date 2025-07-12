const Category = require("../model/CategoryModel");

class AdminCategoryController {
  async create(req, res) {
    try {
      const { name, type } = req.body;
      if (!name || !type) {
        req.flash("error", "Name and Type are required.");
        return res.redirect("/add-category-view");
      }

      const trimmedName = name.trim();
      const globalExists = await Category.findOne({
        name: trimmedName,
        createdBy: null,
      });

      if (globalExists) {
        req.flash("error", "This category already exists.");
        return res.redirect("/get-categories");
      }

      const category = new Category({
        name: trimmedName,
        type,
        createdBy: null,
      });

      await category.save();
      req.flash("message", "Category created successfully.");
      return res.redirect("/get-categories");
    } catch (error) {
      req.flash("error", "Error: " + error.message);
      return res.redirect("/get-categories");
    }
  }

  async addCategoryView(req, res) {
    try {
      const message = req.flash("message")[0];
      const error = req.flash("error")[0];
      res.render("addCategoryView", { user: req.user, message, error });
    } catch (error) {
      req.flash("error", "Error: " + error.message);
      return res.redirect("/get-categories");
    }
  }

  async getCategories(req, res) {
    try {
      const message = req.flash("message")[0];
      const error = req.flash("error")[0];
      const categories = await Category.find({ createdBy: null });

      res.render("category", {
        user: req.user,
        message,
        error,
        categories,
      });
    } catch (error) {
      req.flash("error", "Error: " + error.message);
      res.render("category", {
        user: req.user,
        message,
        error,
        categories: [],
      });
    }
  }
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category || category.createdBy !== null) {
        req.flash("error", "Global category not found.");
        return res.redirect("/get-categories");
      }

      res.render("editCategoryView", {
        user: req.user,
        category,
        message: req.flash("message")[0],
        error: req.flash("error")[0],
      });
    } catch (error) {
      req.flash("error", "Error: " + error.message);
      return res.redirect("/get-categories");
    }
  }

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, type } = req.body;

      const category = await Category.findById(id);
      if (!category || category.createdBy !== null) {
        req.flash("error", "Global category not found.");
        return res.redirect("/get-categories");
      }

      category.name = name;
      category.type = type;
      await category.save();

      req.flash("message", "Category updated successfully.");
      res.redirect("/get-categories");
    } catch (error) {
      req.flash(
        "error",
        error.code === 11000
          ? "Category with this name already exists."
          : error.message
      );
      res.redirect("/get-categories");
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);

      if (!category || category.createdBy !== null) {
        req.flash("error", "Only admin can delete global categories.");
        return res.redirect("/get-categories");
      }

      await Category.findByIdAndDelete(id);
      req.flash("message", "Category deleted successfully.");
      res.redirect("/get-categories");
    } catch (error) {
      req.flash("error", "Error deleting category: " + error.message);
      res.redirect("/get-categories");
    }
  }
}

module.exports = new AdminCategoryController();
