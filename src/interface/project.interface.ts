import { IStatus } from "./status.interface";
import { IUser } from "./user.interface";

export interface IProject {
  _id: string;
  name: string;
  slug?: string;
  status?: IStatus;
  users?: Array<IUser>
  start_date?: Date;
  end_date?: Date;
  total_task?: number;
  process?: number;
}