import { ResponseUserDto } from "@/types";
import axios from "./axios";

const updateCurrentSkills = async (
  skills?: number[],
): Promise<ResponseUserDto> => {
  const response = await axios.put(`/current-user/skills`, { skills });
  return response.data;
};

export const currentUser = {
  updateCurrentSkills,
};
