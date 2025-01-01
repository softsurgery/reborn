export interface DeviceInfo{
    platform?: string;
    model?: string;
    version?: string;
    manufacturer?: string;
    type?: string;
}

export interface Bug{
    title?: string;
    description?: string;
    category?: string;
    device?: DeviceInfo;
    createdAt?: string;
}