import axios from "./axios";
import { ResponseJobStatisticsDto } from "~/types";

const findById = async (id: string): Promise<ResponseJobStatisticsDto> => {
  const response = await axios.get<ResponseJobStatisticsDto>(
    `/job-statistics/${id}`,
  );
  return response.data;
};

export const jobStatistics = {
  findById,
};
