export interface IStatus {
  type: string;
  position: number;
  is_hiding: boolean;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IStatusResponse {
  message: string;
  data: IStatus[];
  pagination: IPagination;
}
export interface IStatusListResponse {
  total: number;
  statuses: IStatus[];
}