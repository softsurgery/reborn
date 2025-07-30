import { CreateFeedbackDto, Feedback } from "~/types";
import axios from "./axios";

async function create(feedback: CreateFeedbackDto) {
  const response = await axios.post("/feedback", feedback);
  return response.data;
}

export const feedback = {
  create,
};
