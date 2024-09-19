export interface IPriority {
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

export interface IPriorityResponse {
  message: string;
  data: IPriority[];
  pagination: IPagination;
}

export interface IPriorityListResponse {
  total: number;
  priorities: IPriority[];
}