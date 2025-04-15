import { Feedback } from "~/types";
import axios from "./axios";

async function postFeedback(feedback: Feedback): Promise<Feedback> {
  console.log(process.env.EXPO_PUBLIC_API_BASE_URL);
  const response = await axios.post("/api/feedbacks", feedback);
  return response.data;
}

export const feedback = {
  postFeedback,
};
