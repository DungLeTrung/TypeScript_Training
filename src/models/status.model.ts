import { model, Schema } from "mongoose";
import { IPriority } from "../interface/priority.interface";
import { IStatus } from "../interface/status.interface";
import { REGEX } from "../utils/regex";

const statusSchema = new Schema<IStatus> ({
  type: {
    type: String,
    required: true,
    trim: true, 
    validate: {
      validator: function(v: string) {
        return REGEX.USERNAME.test(v);
      },
      message: 'Username must be at least 5 characters long',
    },
  },
  position: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true
})

export const Status = model<IStatus>('Status', statusSchema);
