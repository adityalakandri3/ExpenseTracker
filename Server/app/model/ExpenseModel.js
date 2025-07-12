const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
   type: {
    type: String,
    enum: ['expense', 'income'],
    required: true,
  },
  note: {
    type: String,
    maxlength: 255,
  },
},{
    timestamps:true,
    versionKey:false
});

const ExpenseModel = mongoose.model("expenses", expenseSchema);
module.exports = ExpenseModel;
