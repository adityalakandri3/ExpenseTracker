const mongoose = require("mongoose");
const BlogCategoryModel = require("../model/BlogCategory");
const postModel = require("../model/Posts");
const fs = require("fs");

class PostController {
  //create post
  async create(req, res) {
    try {
      const user = req.user;
      const { title, content, tags, category } = req.body;
      if (!title || !content || !tags || !category) {
        return res.status(400).json({
          status: false,
          message: "All fields are required",
        });
      }
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      const data = new postModel({
        title,
        content,
        tags: tagsArray,
        author: user._id,
        categoryId: category,
      });
      if (req.file) {
        data.image = req.file.path;
      }
      const categoryExist = await BlogCategoryModel.findById(category);
      if (!categoryExist) {
        return res.status(400).json({
          status: false,
          message: "Category not found.",
        });
      }
      const post = await data.save();
      return res.status(200).json({
        status: true,
        message: "Post created successfully.",
        data: post,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
  //get post
  async getPost(req, res) {
    try {
      const posts = await postModel
        .find()
        .populate("categoryId", "name")
        .populate("author", "name");

      return res.status(200).json({
        status: true,
        message: "Post retrieved successfully.",
        total: posts.length,
        data: posts,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  //get post by id
  async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await postModel
        .findById(id)
        .populate("categoryId", "name")
        .populate("author", "name");
      if (!post) {
        return res.status(400).json({
          status: false,
          message: "Post not found.",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Post fetched by id successfully.",
        data: post,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
  //upate post

  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const user = req.user._id;
      const post = await postModel.findById(id);

      if (!post) {
        return res.status(400).json({
          status: false,
          message: "Post not found.",
        });
      }

      if (post.author.toString() !== user.toString()) {
        return res.status(400).json({
          status: false,
          message: "You are not authorised to update this post",
        });
      }

      const { title, content, tags, category } = req.body;

      if (!title || !content || !tags || !category) {
        return res.status(400).json({
          status: false,
          message: "All fields are required.",
        });
      }

      const tagsArray = tags.split(",").map((tag) => tag.trim());

      const categoryExist = await BlogCategoryModel.findById(category);
      if (!categoryExist) {
        return res.status(400).json({
          status: false,
          message: "Category not found.",
        });
      }

      const updatedData = {
        title,
        content,
        tags: tagsArray,
        categoryId: category,
      };

      // ✅ If a new image is uploaded
      if (req.file) {
        // Delete old image if exists
        if (post.image) {
          fs.unlink(post.image, (err) => {
            if (err) {
              console.error("Failed to delete old image:", err.message);
            } else {
              console.log("Old image deleted successfully.");
            }
          });
        }

        // Save new image path
        updatedData.image = req.file.path;
      }

      const updatedPost = await postModel.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      return res.status(200).json({
        status: true,
        message: "Post updated successfully.",
        data: updatedPost,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  //delete post
  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const user = req.user._id;
      const post = await postModel.findById(id);
      if (post.author.toString() !== user.toString()) {
        return res.status(400).json({
          status: false,
          message: "You are not authorised to update this post",
        });
      }
      if (post) {
        if (post.image) {
          fs.unlinkSync(post.image, (err) => {
            if (err) {
              console.log("Error deleting image.");
            } else {
              console.log("Image deleted successfully.");
            }
          });
        }
      } else {
        return res.status(400).json({
          status: false,
          message: "Post not found.",
        });
      }
      const deletePost = await postModel.findByIdAndDelete(id);
      return res.status(200).json({
        status: true,
        message: "Post deleted successfully.",
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
  //filter by category
  async filterPostByCategory(req, res) {
    try {
      const categoryId = req.params.categoryId;

      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          status: false,
          message: "Invalid category ID.",
        });
      }

      const getPost = await BlogCategoryModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(categoryId) } },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "categoryId",
            as: "post",
          },
        },
        {
          $addFields: {
            totalPosts: { $size: "$post" },
          },
        },
        {
          $project: {
            name: 1,
            totalPosts: 1,
            post: 1,
          },
        },
      ]);

      if (getPost.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Category not found.",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Data fetched successfully.",
        data: getPost[0],
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

 

  
}
module.exports = new PostController();
