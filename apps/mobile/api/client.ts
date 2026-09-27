import {
  QueryParams,
  ResponseUserDto,
  UpdateUserCoverDto,
  UpdateUserDto,
} from "~/types";
import axios from "./axios";

const findCurrent = async (join: string[] = []): Promise<ResponseUserDto> => {
  const response = await axios.get<ResponseUserDto>(`/admin/user/current`, {
    params: { join: join.join(",") },
  });
  return response.data;
};

const findById = async (
  id: string,
  query?: Pick<QueryParams, "join">,
): Promise<ResponseUserDto> => {
  const response = await axios.get<ResponseUserDto>(`/admin/user/${id}`, {
    params: query,
  });
  return response.data;
};

const findByUsername = async (
  username: string,
  query?: Pick<QueryParams, "join">,
): Promise<ResponseUserDto> => {
  const response = await axios.get<ResponseUserDto>(
    `/admin/user/username/${username}`,
    {
      params: query,
    },
  );
  return response.data;
};

const findByEmail = async (
  email: string,
  query?: Pick<QueryParams, "join">,
): Promise<ResponseUserDto> => {
  const response = await axios.get<ResponseUserDto>(
    `/admin/user/email/${email}`,
    {
      params: query,
    },
  );
  return response.data;
};
const updateCurrent = async (
  updateClientDto: UpdateUserDto,
): Promise<ResponseUserDto> => {
  const response = await axios.put(`/admin/user/current`, updateClientDto);
  return response.data;
};

const updateCover = async (
  updateUserCoverDto: UpdateUserCoverDto,
): Promise<ResponseUserDto> => {
  const response = await axios.put(`/admin/user/cover`, updateUserCoverDto);
  return response.data;
};

const getSkills = async (id: string): Promise<number[] | null> => {
  const response = await axios.get(`/admin/user/skills/${id}`);
  return response.data;
};

const getMobileAppSettings = async (): Promise<any> => {
  const response = await axios.get(`/current-user/mobile-app-settings`);
  return response.data;
};

const updateQuickActions = async (activeIds: string[]): Promise<any> => {
  const response = await axios.put(`/current-user/mobile-app-settings/quick-actions`, {
    activeIds,
  });
  return response.data;
};

export const client = {
  findCurrent,
  findById,
  findByUsername,
  findByEmail,
  getSkills,
  updateCover,
  updateCurrent,
  getMobileAppSettings,
  updateQuickActions,
};
