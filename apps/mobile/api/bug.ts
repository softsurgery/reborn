import axios from "./axios";
import { Bug } from "~/types";

async function postBug(bug: Bug): Promise<Bug> {
  const response = await axios.post("api/client/bug", bug);
  return response.data;
}

export const bug = {
  postBug,
};