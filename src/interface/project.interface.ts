import { IStatus } from "./status.interface";
import { ITask } from "./task.interface";
import { IUser } from "./user.interface";

export interface IProject {
  name: string;
  slug?: string;
  users?: Array<IUser>;
  start_date?: Date;
  end_date?: Date;
  total_task?: number;
  process?: number;
  tasks?: Array<ITask>
}

export interface IEditProject {
  name: string;
  slug?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface IProjectFilter {
  slug?: string;
  users?: Array<IUser>
  start_date?: Date;
  end_date?: Date;
  total_task?: number;
  process?: number;
  tasks?: Array<ITask>
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IProjectResponse {
  message: string;
  data: IProject[];
  pagination: IPagination;
}

export interface IProjectListResponse {
  total: number;
  projects: IProject[];
}