import { IPriority } from "./priority.interface";
import { IProject } from "./project.interface";
import { IStatus } from "./status.interface";
import { IType } from "./type.interface";
import { IUser } from "./user.interface";

export interface ITask {
  name: string;
  assignees?: IUser;
  project?: IProject;
  start_date?: Date;
  end_date?: Date;
  type?: IType;
  status?: IStatus;
  priority?: IPriority
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ITaskResponse {
  message: string;
  data: ITask[];
  pagination: IPagination;
}
export interface ITaskListResponse {
  total: number;
  tasks: ITask[];
}