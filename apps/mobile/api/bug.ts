import axios from "./axios";
import { Bug } from "~/types";

async function postBug(bug: Bug): Promise<Bug> {
  const response = await axios.post("api/admin/bugs", bug);
  console.log("response", response);
  return response.data;
}

export const bug = {
  postBug,
};