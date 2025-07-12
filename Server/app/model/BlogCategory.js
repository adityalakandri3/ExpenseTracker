const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const BlogCategoryModel = mongoose.model("blogcategories", BlogCategorySchema);
module.exports = BlogCategoryModel;


