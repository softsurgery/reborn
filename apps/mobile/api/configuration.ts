import { ResponseConfigurationNamespaceDto } from "@/types";
import axios from "./axios";

const findGlobalOneByName = async (
  name: string,
): Promise<ResponseConfigurationNamespaceDto> => {
  const response = await axios.get(
    `/configuration/namespace/global/name/${name}`,
  );
  return response.data;
};

const findOneById = async (
  id: string,
): Promise<ResponseConfigurationNamespaceDto> => {
  const response = await axios.get(`/configuration/namespace/${id}`);
  return response.data;
};

const findAll = async (): Promise<ResponseConfigurationNamespaceDto[]> => {
  const response = await axios.get(`/configuration/all`);
  return response.data;
};

const findUserOneByName = async (
  name: string,
): Promise<ResponseConfigurationNamespaceDto> => {
  const response = await axios.get(`/configuration/namespace/user/name/${name}`);
  return response.data;
};

const updateConfigurationParams = async (
  dtos: { id: string | number; value: string; variant: string }[]
) => {
  const response = await axios.put(`/configuration`, dtos);
  return response.data;
};

export const configuration = {
  findGlobalOneByName,
  findOneById,
  findAll,
  findUserOneByName,
  updateConfigurationParams,
};
