import { Schema, model, Document } from 'mongoose';
import { ITask } from '../interface/task.interface';
import { REGEX } from '../utils/regex';

const taskSchema = new Schema<ITask>({
  name: {
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
  assignees: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
  },
  project_id: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'Type',
    required: true,
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'Status', 
    required: true,
  },
  priority: {
    type: Schema.Types.ObjectId,
    ref: 'Status', 
    required: true, 
  }
}, {
  timestamps: true 
});

export const Task = model<ITask>('Task', taskSchema);
