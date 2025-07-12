const mongoose = require("mongoose");
const commentsModel = require("../model/Comments");
const postModel = require("../model/Posts");
class CommentController {
 async createComment(req, res) {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const user = req.user._id;

    if (!content || !postId) {
      return res.status(400).json({
        status: false,
        message: "All fields are required.",
      });
    }

    const existingPost = await postModel.findById(postId);
    if (!existingPost) {
      return res.status(404).json({
        status: false,
        message: "Post not found.",
      });
    }

    const data = new commentsModel({
      content,
      postId,
      userId: user,
    });

    const comment = await data.save();

    return res.status(201).json({
      status: true,
      message: "Comment posted successfully.",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}

  async toggleLike(req, res) {
    try {
      const userId = req.user._id;
      const { id } = req.params;

      const post = await postModel.findById(id);
      if (!post) {
        return res.status(400).json({
          status: false,
          message: "Post not found.",
        });
      }
      const index = post.likes.indexOf(userId);
      if (index === -1) {
        post.likes.push(userId);
        await post.save();
        return res.status(200).json({
          status: true,
          message: "Post liked",
        });
      } else {
        post.likes.splice(index, 1);
        await post.save();
        return res.status(200).json({
          status: true,
          message: "Post unliked",
        });
      }
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
  async getLikesByCount(req, res) {
    try {
      const posts = await postModel.aggregate([
        {
          $addFields: {
            likesCount: { $size: "$likes" },
          },
        },
        {
          $sort: { likesCount: -1 },
        },
        {
          $project: {
            title: 1,
            content: 1,
            likesCount: 1,
            categoryId: 1,
            author: 1,
          },
        },
      ]);
      return res.status(200).json({
        status: true,
        message: "Likes sorted",
        data: posts,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
  async getCommentsForPost(req, res) {
    try {
      const { postId } = req.params;

      const comments = await commentsModel.aggregate([
        { $match: { postId: new mongoose.Types.ObjectId(postId) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            content: 1,
            createdAt: 1,
            "user._id": 1,
            "user.name": 1,
            "user.email": 1,
          },
        },
      ]);
      return res.status(200).json({
        status: true,
        message: "Comments retrived successfully.",
        data: comments,
      });
    } catch (error) {
      return res.status(400).json({
        status: true,
        message: error.message,
      });
    }
  }
}
module.exports = new CommentController();
