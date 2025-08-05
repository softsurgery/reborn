import { Paginated, QueryParams } from "~/types";
import axios from "../axios";
import { ResponseRegionDto } from "~/types/content";

const findPaginated = async ({
  page = "1",
  limit = "10",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseRegionDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseRegionDto>>(
    `/public/region/list`,
    { params }
  );
  return response.data;
};

const findAll = async (): Promise<ResponseRegionDto[]> => {
  const response = await axios.get<ResponseRegionDto[]>(`/public/region/all`);
  return response.data;
};

const findById = async (id: number): Promise<ResponseRegionDto> => {
  const response = await axios.get<ResponseRegionDto>(`/public/region/${id}`);
  return response.data;
};

export const region = {
  findPaginated,
  findAll,
  findById,
};
