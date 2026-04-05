import { ResponseUserDto, UpdateUserDto } from "~/types";
import axios from "./axios";

const findCurrent = async (join: string[] = []): Promise<ResponseUserDto> => {
  const response = await axios.get<ResponseUserDto>(`/admin/user/current`, {
    params: { join: join.join(",") },
  });
  return response.data;
};

const findById = async (
  id: string,
  join: string[] = [],
): Promise<ResponseUserDto> => {
  const response = await axios.get<ResponseUserDto>(`/admin/user/${id}`, {
    params: { join: join.join(",") },
  });
  return response.data;
};

const updateCurrent = async (
  updateClientDto: UpdateUserDto,
): Promise<ResponseUserDto> => {
  const response = await axios.put(`/admin/user/current`, updateClientDto);
  return response.data;
};

export const client = {
  findCurrent,
  findById,
  updateCurrent,
};
