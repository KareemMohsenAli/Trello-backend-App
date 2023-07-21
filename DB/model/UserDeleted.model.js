import { Schema, model,Types } from "mongoose";
const userDeletedSchema = new Schema({
    users:[{type:Types.ObjectId,ref:"User",required: true }, { timestamps: true }]
})

export const deletedSchemaModel = model("DletedUser", userDeletedSchema);