import * as Device from "expo-device";

export const generateDeviceInfo = () => {
  return {
    platform: Device.osName || undefined,
    version: Device.osVersion || undefined,
    model: Device.modelName || undefined,
    manufacturer: Device.manufacturer || undefined,
  };
};
