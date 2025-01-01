import { addDoc, collection, getFirestore } from "firebase/firestore";
import { generateDeviceInfo } from "~/lib/device-info";
import { Result } from "~/types";
import { Feedback } from "~/types/Feedback";

async function postFeedback(feedback: Feedback): Promise<Result> {
  const firestore = getFirestore();

  try {
    const feedbackRef = collection(firestore, "feedback");
    feedback = {
      ...feedback,
      createdAt: new Date().toISOString(),
      device: generateDeviceInfo(),
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
