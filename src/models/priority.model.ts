import { model, Schema } from "mongoose";
import { IPriority } from "../interface/priority.interface";
import { REGEX } from "../utils/regex";

const prioritySchema = new Schema<IPriority> ({
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

export const Priority = model<IPriority>('Priority', prioritySchema);
