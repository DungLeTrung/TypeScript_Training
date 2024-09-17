import { Document } from 'mongoose';
import { IProject } from './project.interface';
import { USER_ROLE } from '../utils/const';

export interface IUser extends Document {
  username: string;
  password: string;
  role: USER_ROLE;
  name?: string;
  email?: string;
  date_of_birth?: Date;
  invite_id?: string;
  is_active: boolean;
  projects?: Array<IProject>
}

export interface IUserRegister {
  username: string;
  password: string;
  role?: USER_ROLE;
  name?: string;
  email?: string;
  date_of_birth?: Date;
  invite_id?: string;
  is_active?: boolean;
  projects?: Array<IProject>
}

export interface ILoginUserInput {
  username: string;
  password: string;
}

export interface ILoginResult extends IUser {
  accessToken: string;
  refreshToken: string;
}