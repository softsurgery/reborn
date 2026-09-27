import axios from "./axios";
import {
  CreateJobRequestDto,
  Paginated,
  QueryParams,
  ResponseJobRequestDto,
} from "@/types";

const findPaginated = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseJobRequestDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseJobRequestDto>>(
    `/job-request/list`,
    {
      params,
    },
  );

  return response.data;
};

const findPaginatedIncoming = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseJobRequestDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseJobRequestDto>>(
    `/job-request/list-incoming`,
    {
      params,
      paramsSerializer: { indexes: null },
    },
  );

  return response.data;
};

const findPaginatedOngoing = async ({
  page = "1",
  limit = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: QueryParams): Promise<Paginated<ResponseJobRequestDto>> => {
  const params: { [key: string]: any } = {
    page,
    limit,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseJobRequestDto>>(
    `/job-request/list-ongoing`,
    {
      params,
      paramsSerializer: { indexes: null },
    },
  );

  return response.data;
};

const findAll = async (): Promise<ResponseJobRequestDto[]> => {
  const response = await axios.get<ResponseJobRequestDto[]>(`/job-request/all`);
  return response.data;
};

const findById = async (
  jobRequestId: number,
  join?: string,
): Promise<ResponseJobRequestDto> => {
  const response = await axios.get<ResponseJobRequestDto>(
    `/job-request/${jobRequestId}`,
    {
      params: { join },
    },
  );
  return response.data;
};

const findRequested = async (id: string): Promise<ResponseJobRequestDto> => {
  const response = await axios.get<ResponseJobRequestDto>(
    `/job-request/${id}/exists`,
  );
  return response.data;
};

const create = async (createJobRequestDto: CreateJobRequestDto) => {
  const response = await axios.post<ResponseJobRequestDto>(
    `/job-request`,
    createJobRequestDto,
  );
  return response.data;
};

const update = async (
  id: number,
  updateJobRequestDto: Partial<CreateJobRequestDto>,
) => {
  const response = await axios.put<ResponseJobRequestDto>(
    `/job-request/${id}`,
    updateJobRequestDto,
  );
  return response.data;
};

const approve = async (id: number) => {
  const response = await axios.put<ResponseJobRequestDto>(
    `/job-request/${id}/approve`,
  );
  return response.data;
};

const reject = async (id: number) => {
  const response = await axios.put<ResponseJobRequestDto>(
    `/job-request/${id}/reject`,
  );
  return response.data;
};

const waitlist = async (id: number) => {
  const response = await axios.put<ResponseJobRequestDto>(
    `/job-request/${id}/waitlist`,
  );
  return response.data;
};

const cancel = async (id: number) => {
  const response = await axios.put<ResponseJobRequestDto>(
    `/job-request/${id}/cancel`,
  );
  return response.data;
};

export const jobRequest = {
  findPaginated,
  findPaginatedIncoming,
  findPaginatedOngoing,
  findAll,
  findById,
  findRequested,
  create,
  update,
  approve,
  reject,
  waitlist,
  cancel,
};
