import { TASK_TYPE } from "../utils/const";

export interface IType {
  type: string;
  color?: string;
  is_hiding: boolean;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ITypeResponse {
  message: string;
  data: IType[];
  pagination: IPagination;
}
export interface ITypeListResponse {
  total: number;
  types: IType[];
}