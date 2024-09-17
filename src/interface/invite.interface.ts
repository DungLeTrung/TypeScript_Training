import { IProject } from "./project.interface";

export interface IInvite {
  _id: string;
  invite_id: string;
  project: IProject;
  is_used: boolean;
}