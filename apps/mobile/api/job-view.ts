import {
  CreateJobViewDto,
  Paginated,
  QueryParams,
  ResponseJobViewDto,
} from "~/types";
import axios from "./axios";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseJobViewDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseJobViewDto>>(
    `/job-view/list`,
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
}: QueryParams): Promise<Paginated<ResponseJobViewDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseJobViewDto>>(
    `/job-view/user-list`,
    {
      params,
    }
  );

  return response.data;
};

const findAll = async (): Promise<ResponseJobViewDto[]> => {
  const response = await axios.get<ResponseJobViewDto[]>(`/job-save/all`);
  return response.data;
};

const findById = async (jobRequestId: number): Promise<ResponseJobViewDto> => {
  const response = await axios.get<ResponseJobViewDto>(
    `/job-view/${jobRequestId}`
  );
  return response.data;
};

const findViewed = async (id: string): Promise<ResponseJobViewDto | null> => {
  const response = await axios.get<ResponseJobViewDto>(
    `/job-view/${id}/exists`
  );
  return response.data;
};

const create = async (createJobViewDto: CreateJobViewDto) => {
  const response = await axios.post<ResponseJobViewDto>(
    `/job-view`,
    createJobViewDto
  );
  return response.data;
};

export const jobView = {
  findPaginated,
  findUserPaginated,
  findAll,
  findById,
  findViewed,
  create,
};
