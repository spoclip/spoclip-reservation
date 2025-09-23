type ApiResponse<T> = {
  data: T;
  status: string;
  code: number;
  timestamp: string;
  path: string;
};

export type { ApiResponse };
