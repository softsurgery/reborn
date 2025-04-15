import { Feedback } from "~/types";
import axios from "./axios";

async function postFeedback(feedback: Feedback): Promise<Feedback> {
  const response = await axios.post("api/client/feedback", feedback);
  return response.data;
}

export const feedback = {
  postFeedback,
};
