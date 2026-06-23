export type PagingType = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export type ResponseType = {
  success: boolean;
  statusCode: number;
  message: string;
  data: unknown;
};
