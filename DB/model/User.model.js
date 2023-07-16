import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    isOnline: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    phone:String,
  },
  { timestamps: true }
);

const userModel = model("User", userSchema);
export default userModel;
