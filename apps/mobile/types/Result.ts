export interface Result<T> {
  message: string;
  responseCode?: number;
  success?: boolean;
  data?: T;
}
