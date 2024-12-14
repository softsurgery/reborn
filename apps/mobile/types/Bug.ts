export interface DeviceInfo{
    id?: string;
    platform?: string;
    model?: string;
    version?: string;
    manufacturer?: string;
}

export interface Bug{
    title?: string;
    description?: string;
    category?: string;
    device?: DeviceInfo;
    createdAt?: string;
}