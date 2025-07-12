const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailVerificationSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref:'users',
    required:true
  },
  otp:{
    type:String,
    required:true
  },
  created_At:{
    type:Date,
    default:Date.now,
    expires:'15m'
  }
});

const emailVerificationModel = mongoose.model('emailVerification',emailVerificationSchema);
module.exports = emailVerificationModel;