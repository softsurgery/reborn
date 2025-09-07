import axios from "./axios";
import { Paginated, QueryParams, ResponseJobTagDto } from "~/types";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseJobTagDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseJobTagDto>>(
    `/job-tag/list`,
    {
      params,
    }
  );

  return response.data;
};

const findAll = async (): Promise<ResponseJobTagDto[]> => {
  const response = await axios.get<ResponseJobTagDto[]>(`/job-tag/all`);
  return response.data;
};

const findById = async (jobTagId: number): Promise<ResponseJobTagDto> => {
  const response = await axios.get<ResponseJobTagDto>(`/job-tag/${jobTagId}`);
  return response.data;
};

export const jobTag = {
  findPaginated,
  findAll,
  findById,
};
