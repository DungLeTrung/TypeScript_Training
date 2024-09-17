import { model, Schema } from "mongoose";
import { IPriority } from "../interface/priority.interface";
import { REGEX } from "../utils/regex";

const prioritySchema = new Schema<IPriority> ({
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

export const Priority = model<IPriority>('Project', prioritySchema);
