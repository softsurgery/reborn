import { DeviceInfo } from "./DeviceInfo";

export interface Feedback {
  rating?: number;
  category?: string;
  message?: string;
  device?: DeviceInfo;
  createdAt?: string;
}
