import { model, Schema } from "mongoose";
import { IPriority } from "../interface/priority.interface";
import { IStatus } from "../interface/status.interface";
import { REGEX } from "../utils/regex";

const statusSchema = new Schema<IStatus> ({
  type: {
    type: String,
    required: true,
    trim: true, 
  },
  position: {
    type: Number,
    required: true,
  },
  is_hiding: {
    type: Boolean,
    default: false, 
  },
}, {
  timestamps: true
})

export const Status = model<IStatus>('Status', statusSchema);
