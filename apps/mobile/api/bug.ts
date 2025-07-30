import axios from "./axios";
import { CreateBugDto } from "~/types";

async function create(bug: CreateBugDto) {
  const response = await axios.post("bug", bug);
  return response.data;
}

export const bug = {
  create,
};
