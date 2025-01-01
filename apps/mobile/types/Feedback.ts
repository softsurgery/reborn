export interface DeviceInfo {
    id?: string;
    platform?: string;
    model?: string;
    version?: string;
    manufacturer?: string;
  }
  
  export interface Feedback{
    rating?: number; 
    category?: string; 
    message?: string; 
    device?: DeviceInfo;
    createdAt?: string;
  } 
  