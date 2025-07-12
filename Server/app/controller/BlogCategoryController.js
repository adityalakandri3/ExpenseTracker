const BlogCategoryModel = require("../model/BlogCategory");

class BlogCategoryController {
  async create(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        req.flash("error", "Category name is required.");
        return res.redirect("/blog-category-view");
      }

      const existingCategory = await BlogCategoryModel.findOne({
        name: { $regex: new RegExp("^" + name + "$", "i") },
      });

      if (existingCategory) {
        req.flash("error", "Category already exists.");
        return res.redirect("/blog-category-view");
      }

      const newCategory = new BlogCategoryModel({ name });
      const blogcategory = await newCategory.save();

      if (blogcategory) {
        req.flash("message", "Blog Category created successfully.");
        return res.redirect("/blog-category-view");
      }
    } catch (error) {
      req.flash("error", "Error creating category.");
      return res.redirect("/blog-category-view");
    }
  }

  async createView(req, res) {
    try {
      const message = req.flash("message")[0];
      const error = req.flash("error")[0];
      res.render("createBlogView", {
        user: req.user,
        message,
        error,
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/blog-category-view");
    }
  }

  async getBlogCategory(req, res) {
    try {
      const blogcategory = await BlogCategoryModel.find();
      return res.status(200).json({
        status: true,
        message: "Blog Categories fetched successfully.",
        total: blogcategory.length,
        data: blogcategory,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
  async blogCategoryTableView(req, res) {
    try {
      const message = req.flash("message")[0];
      const error = req.flash("error")[0];
      const data = await BlogCategoryModel.find();
      res.render("blogCategoryTableView", {
        user: req.user,
        message,
        error,
        data,
      });
    } catch (error) {
      req.flash("An error occurred while rendering the form.");
      return res.redirect("/admin-dashboard");
    }
  }
  async getBlogCategoryById(req, res) {
    try {
      const { id } = req.params;
      const message = req.flash("message")[0];
      const error = req.flash("error")[0];
      const blogcategory = await BlogCategoryModel.findById(id);
      res.render("blogCategoryEdit", {
        message,
        error,
        user: req.user,
        data: blogcategory,
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/blog-category-view");
    }
  }

  async updateBlogCategory(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        req.flash("error", "Category name is required.");
        return res.redirect(`/get-blog-category/${id}`);
      }

      const existingCategory = await BlogCategoryModel.findOne({
        name: { $regex: new RegExp("^" + name + "$", "i") },
        _id: { $ne: id },
      });

      if (existingCategory) {
        req.flash("error", "Category already exists.");
        return res.redirect(`/get-blog-category/${id}`);
      }

      const updatedBlogCategory = await BlogCategoryModel.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );

      if (!updatedBlogCategory) {
        req.flash("error", "Blog Category not found.");
        return res.redirect("/blog-category-view");
      }

      req.flash("message", "Blog Category updated successfully.");
      return res.redirect("/blog-category-view");
    } catch (error) {
      console.error("Error updating category:", error);
      req.flash("error", "An error occurred while updating the category.");
      return res.redirect(`/admin/edit-category/${req.params.id}`);
    }
  }

  async deleteBlogCategory(req, res) {
    try {
      const { id } = req.params;

      const blogcategory = await BlogCategoryModel.findById(id);

      if (!blogcategory) {
        req.flash("error", "Blog Category not found.");
        return res.redirect("/blog-category-view");
      }

      await BlogCategoryModel.findByIdAndDelete(id);

      req.flash("message", "Blog Category deleted successfully.");
      return res.redirect("/blog-category-view");
    } catch (error) {
      console.error("Error deleting category:", error);
      req.flash("error", "An error occurred while deleting the category.");
      return res.redirect("/blog-category-view");
    }
  }
}

module.exports = new BlogCategoryController();
