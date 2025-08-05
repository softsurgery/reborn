import { ResponseClientDto } from "~/types";
import axios from "./axios";

const findCurrent = async (): Promise<ResponseClientDto> => {
  const response = await axios.get<ResponseClientDto>(`/client/current`);
  return response.data;
};

export const client = {
  findCurrent,
};
