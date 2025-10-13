import {
  CreateJobSaveDto,
  Paginated,
  QueryParams,
  ResponseJobSaveDto,
} from "~/types";
import axios from "./axios";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseJobSaveDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseJobSaveDto>>(
    `/job-save/list`,
    {
      params,
    }
  );

  return response.data;
};

const findUserPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseJobSaveDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseJobSaveDto>>(
    `/job-save/user-list`,
    {
      params,
    }
  );

  return response.data;
};

const findAll = async (): Promise<ResponseJobSaveDto[]> => {
  const response = await axios.get<ResponseJobSaveDto[]>(`/job-save/all`);
  return response.data;
};

const findById = async (jobRequestId: number): Promise<ResponseJobSaveDto> => {
  const response = await axios.get<ResponseJobSaveDto>(
    `/job-save/${jobRequestId}`
  );
  return response.data;
};

const findSaved = async (id: string): Promise<ResponseJobSaveDto | null> => {
  const response = await axios.get<ResponseJobSaveDto>(
    `/job-save/${id}/exists`
  );
  return response.data;
};

const create = async (createJobSaveDto: CreateJobSaveDto) => {
  const response = await axios.post<ResponseJobSaveDto>(
    `/job-save`,
    createJobSaveDto
  );
  return response.data;
};

const remove = async (id: string) => {
  const response = await axios.delete<ResponseJobSaveDto>(`/job-save/${id}`);
  return response.data;
};

export const jobSave = {
  findPaginated,
  findUserPaginated,
  findAll,
  findById,
  findSaved,
  create,
  remove,
};
