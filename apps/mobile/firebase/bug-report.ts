import { addDoc, collection, getFirestore } from "firebase/firestore";
import DeviceInfo from "react-native-device-info";
import { Result } from "~/types";
import { Bug } from "~/types/Bug";

async function postBug(bug: Bug): Promise<Result> {
  const firestore = getFirestore();

  try {
    const bugReportRef = collection(firestore, "bugs");
    bug = {
        ...bug,
        createdAt: new Date().toISOString(),
        device: {
            // id: await DeviceInfo.getUniqueId(),
            // platform: await DeviceInfo.getBaseOs(),
            // model: DeviceInfo.getModel(),
            // version: DeviceInfo.getSystemVersion(),
            // manufacturer: await DeviceInfo.getManufacturer()
        }
    }
    await addDoc(bugReportRef, bug);
    return {
      message: "Bug submitted successfully",
      success: true,
    };
  } catch (error) {
    return { message: "Failed to submit bug report", success: false };
  }
}

export const bugService = {
  postBug,
};
