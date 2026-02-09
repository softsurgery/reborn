import { ResponseRefTypeDto } from "~/types";
import axios from "./axios";

const findAllRegions = async (): Promise<ResponseRefTypeDto[]> => {
  const response = await axios.get<ResponseRefTypeDto[]>(
    `/reference-impl/regions`,
  );
  return response.data;
};

export const refImpl = {
  findAllRegions,
};
