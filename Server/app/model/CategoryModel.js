const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    default: null, // null = global category created by admin
  }
});

// Prevent duplicate category names for the same user (or globally)
categorySchema.index({ name: 1, createdBy: 1 }, { unique: true });


const CategoryModel = mongoose.model('categories', categorySchema);
module.exports = CategoryModel;
