export interface Result<T = undefined> {
  message: string;
  responseCode?: number;
  success?: boolean;
  data?: T;
}
