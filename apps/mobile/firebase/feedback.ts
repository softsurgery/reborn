import { addDoc, collection, getFirestore } from "firebase/firestore";
import DeviceInfo from "react-native-device-info";
import { Result } from "~/types";
import { Feedback } from "~/types/Feedback";

async function postFeedback(feedback: Feedback): Promise<Result> {
  const firestore = getFirestore();

  try {
    const feedbackRef = collection(firestore, "feedback");
    feedback = {
      ...feedback,
      createdAt: new Date().toISOString(),
      device: {
        // id: await DeviceInfo.getUniqueId(),
        // platform: await DeviceInfo.getBaseOs(),
        // model: DeviceInfo.getModel(),
        // version: DeviceInfo.getSystemVersion(),
        // manufacturer: await DeviceInfo.getManufacturer(),
      },
    };
    await addDoc(feedbackRef, feedback);
    return {
      message: "Feedback submitted successfully",
      success: true,
    };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { message: "Failed to submit feedback", success: false };
  }
}

export const feedbackService = {
  postFeedback,
};
