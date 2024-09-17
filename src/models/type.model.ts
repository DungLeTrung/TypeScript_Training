import { model, Schema } from "mongoose";
import { IType } from "../interface/type.interface";
import { TASK_TYPE } from "../utils/const";

const typeSchema = new Schema<IType> ({
  type: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  }
}, {
  timestamps: true,
})

export const Type = model<IType>('Type', typeSchema);