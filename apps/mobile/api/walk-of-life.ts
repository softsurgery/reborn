import axios from "./axios";
import { Education, Experience, ResponseProfileDto } from "~/types";

const updateExperience = async (
  id: string,
  experiences: Experience[]
): Promise<ResponseProfileDto> => {
  const response = await axios.put(`/walk-of-life/experiences/${id}`, {
    experiences,
  });
  return response.data;
};

const updateEducation = async (
  id: string,
  educations: Education[]
): Promise<ResponseProfileDto> => {
  const response = await axios.put(`/walk-of-life/educations/${id}`, {
    educations,
  });
  return response.data;
};

const updateSkills = async (
  id: string,
  skills: Experience[]
): Promise<ResponseProfileDto> => {
  const response = await axios.put(`/walk-of-life/skills/${id}`, {
    skills,
  });
  return response.data;
};

export const walkOfLife = {
  updateExperience,
  updateEducation,
  updateSkills,
};
