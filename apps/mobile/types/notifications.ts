import { ResponseUserDto } from "./user-management";
import { DatabaseEntity } from "./utils";

export enum NotificationType {
  TEST = "TEST",
  NEW_SIGIN = "NEW_SIGIN",
  NEW_MESSAGE = "NEW_MESSAGE",
  NEW_JOB_REQUEST = "NEW_JOB_REQUEST",
  JOB_REQUEST_APPROVED = "JOB_REQUEST_APPROVED",
  JOB_REQUEST_REJECTED = "JOB_REQUEST_REJECTED",
}

export interface ResponseNotificationDto extends DatabaseEntity {
  id: string;
  type: NotificationType;
  userId?: string;
  user: ResponseUserDto;
  payload?: any;
}
