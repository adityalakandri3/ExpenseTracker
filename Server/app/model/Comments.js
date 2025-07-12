const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    content:{
        type:String,
        required:true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const commentsModel = mongoose.model("comments", CommentsSchema);
module.exports = commentsModel;
