const Category = require("../model/CategoryModel");

class UserCategoryController {
  // Create a user-specific category
  async create(req, res) {
    try {
      const { name, type } = req.body;
      console.log(req.body)

      if (!name || !type) {
        return res.status(400).json({
          status: false,
          message: "Name and type are required.",
        });
      }

      const trimmedName = name.trim();

      // Check if the name already exists globally
      const globalExists = await Category.findOne({
        name: trimmedName,
        createdBy: null,
      });

      if (globalExists) {
        return res.status(400).json({
          status: false,
          message: "This category already exists globally. Use it or choose another name.",
        });
      }

      // Check if it already exists for the user
      const userExists = await Category.findOne({
        name: trimmedName,
        createdBy: req.user._id,
      });

      if (userExists) {
        return res.status(400).json({
          status: false,
          message: "You already have a category with this name.",
        });
      }

      const category = new Category({
        name: trimmedName,
        type,
        createdBy: req.user._id,
      });

      const saved = await category.save();

      res.status(201).json({
        status: true,
        message: "Category created successfully.",
        data: saved,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  // Get all categories (global + user-created)
  async getAll(req, res) {
    try {
      const categories = await Category.find({
        $or: [{ createdBy: null }, { createdBy: req.user._id }],
      });

      res.status(200).json({
        status: true,
        message: "Categories fetched successfully.",
        total: categories.length,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  // Get a single category by ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({
          status: false,
          message: "Category not found.",
        });
      }

      if (
        category.createdBy &&
        category.createdBy.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          status: false,
          message: "You can only access your own categories.",
        });
      }

      res.status(200).json({
        status: true,
        message: "Category fetched successfully.",
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  // Update a user-created category
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, type } = req.body;

      const category = await Category.findById(id);

      if (!category || !category.createdBy) {
        return res.status(404).json({
          status: false,
          message: "Custom category not found.",
        });
      }

      if (category.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: false,
          message: "You can only update your own categories.",
        });
      }

      category.name = name;
      category.type = type;

      const updated = await category.save();

      res.status(200).json({
        status: true,
        message: "Category updated successfully.",
        data: updated,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          status: false,
          message: "A category with this name already exists.",
        });
      }

      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  // Delete a user-created category
  async delete(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);

      if (!category || !category.createdBy) {
        return res.status(404).json({
          status: false,
          message: "Custom category not found.",
        });
      }

      if (category.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: false,
          message: "You can only delete your own categories.",
        });
      }

      await Category.findByIdAndDelete(id);

      res.status(200).json({
        status: true,
        message: "Category deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserCategoryController();
