const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
    },
    mobileNo: {
      type: String,
      required: true,
      unique : false,
    },
    relationship: {
      type: String,
      required: true,
      unique : false,
    },
    sex: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    age: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
