import { Schema, model, Document, Types } from 'mongoose';
import { IProject } from '../interface/project.interface';
import { REGEX } from '../utils/regex';

const projectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true, 
    validate: {
      validator: function(v: string) {
        return REGEX.USERNAME.test(v);
      },
      message: 'Username must be at least 5 characters long',
    },
  },
  slug: {
    type: String,
    trim: true,
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User', 
  }],
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  total_task: {
    type: Number,
    default: 0, 
  },
  process: {
    type: Number,
    default: 0, 
  },
  deletedAt: {
    type: Date
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task', 
  }],
}, {
  timestamps: true 
});

export const Project = model<IProject>('Project', projectSchema);
