import { DeviceInfo } from "./DeviceInfo";

export interface Bug{
    title?: string;
    description?: string;
    category?: string;
    device?: DeviceInfo;
    createdAt?: string;
}