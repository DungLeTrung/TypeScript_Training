import { Schema, model } from 'mongoose';
import { IUser } from '../interface/user.interface';
import { USER_ROLE } from '../utils/const';
import { REGEX } from '../utils/regex';

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return REGEX.USERNAME.test(v);
      },
      message: 'Username must be at least 5 characters long',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return REGEX.PASSWORD.test(v);
      },
      message: 'Password must be at least 8 characters long and contain at least one special character',
    },
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLE),
  },
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    match: [REGEX.EMAIL, 'The email is invalid'], 
    trim: true,
  },
  date_of_birth: {
    type: Date,
    required: false
  },
  invite_id: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true, 
  },
  projects: { type: Schema.Types.ObjectId, ref: 'Project' } 
}, {
  timestamps: true, 
});

export const User = model<IUser>('User', userSchema);