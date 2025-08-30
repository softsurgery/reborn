import axios from "./axios";
import { Paginated, QueryParams, ResponseJobCategoryDto } from "~/types";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseJobCategoryDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseJobCategoryDto>>(
    `/job-category/list`,
    {
      params,
    }
  );

  return response.data;
};

const findAll = async (): Promise<ResponseJobCategoryDto[]> => {
  const response = await axios.get<ResponseJobCategoryDto[]>(
    `/job-category/all`
  );
  return response.data;
};

const findById = async (
  jobCategoryId: number
): Promise<ResponseJobCategoryDto> => {
  const response = await axios.get<ResponseJobCategoryDto>(
    `/job-category/${jobCategoryId}`
  );
  return response.data;
};


export const jobCategory = {
  findPaginated,
  findAll,
  findById,
};
