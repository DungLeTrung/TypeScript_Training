import { model, Schema } from "mongoose";
import { IType } from "../interface/type.interface";
import { TASK_TYPE } from "../utils/const";

const typeSchema = new Schema<IType> ({
  type: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  color: {
    type: String,
    trim: true,
    default: '#000000'
  },
  is_hiding: {
    type: Boolean,
    default: false, 
  },
}, {
  timestamps: true,
})

export const Type = model<IType>('Type', typeSchema);