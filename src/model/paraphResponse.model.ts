export type ParaphResponseModel<T> = {
  errorMessage: string | null;
  refId: string;
  statusCode: string;
  message: string;
  body: T;
  errorCode: number;
};
