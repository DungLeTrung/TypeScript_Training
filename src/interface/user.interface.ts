import { Document } from 'mongoose';
import { USER_ROLE } from '../utils/const';
import { IProject } from './project.interface';
import { ITask } from './task.interface';

export interface IUser extends Document {
  username: string;
  password: string;
  role: USER_ROLE;
  name?: string;
  email?: string;
  date_of_birth?: Date;
  invite_id?: string;
  is_active: boolean;
  projects?: Array<IProject>;
  tasks?: Array<ITask>;

}

export interface IUserUpdate {
  name?: string;
  email?: string;
  date_of_birth?: Date;
  is_active?: boolean;
}

export interface IUserRegister {
  id?: string;
  username: string;
  password: string;
  role?: USER_ROLE;
  name?: string;
  email?: string;
  date_of_birth?: Date;
  invite_id?: string;
  is_active?: boolean;
  projects?: Array<IProject>;
}

export interface ILoginUserInput {
  username: string;
  password: string;
}

export interface ILoginResult extends IUser {
  accessToken: string;
  refreshToken: string;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IUserResponse {
  message: string;
  data: IUser[];
  pagination: IPagination;
}

export interface IUserListResponse {
  total: number;
  users: IUser[];
}