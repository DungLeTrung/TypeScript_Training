import { IPriority } from "./priority.interface";
import { IProject } from "./project.interface";
import { IStatus } from "./status.interface";
import { IType } from "./type.interface";
import { IUser } from "./user.interface";

export interface ITask {
  _id: string;
  name: string;
  assignees?: IUser;
  project_id?: IProject;
  start_date?: Date;
  end_date?: Date;
  type?: IType;
  status?: IStatus;
  priority?: IPriority
}