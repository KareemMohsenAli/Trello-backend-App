import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    deadLine:Date,
    status: {
      type: String,
      enum: ["Done", "Todo", "Doing"],
      default: "Doing",
    },
    assignTo:{
      type:Types.ObjectId,
      ref:"User",
      required:true
    },
    createdBy:{
      type:Types.ObjectId,
      ref:"User",
      required:true
    },
    isDeleted:{
      type:Boolean,
      default:false,

    },
   
  },
  { timestamps: true }
);

const taskModel = model("Task", taskSchema);
export default taskModel;
