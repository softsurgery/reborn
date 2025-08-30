import { Upload } from "./upload";
import { ResponseClientDto } from "./user-management";
import { DatabaseEntity } from "./utils";

export interface ResponseJobDto extends DatabaseEntity {
  id: string;
  title: string;
  description: string;
  price: number;
  postedBy: ResponseClientDto;
  tags: ResponseJobTagDto[];
  categoryId: number;
  uploads: ResponseJobUploadDto[];
}
export interface CreateJobDto {
  title: string;
  description: string;
  price: number;
  tagIds: number[];
  currencyId?: string;
  categoryId?: number;
  uploads?: { uploadId: number }[];
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
  uploads?: { id: number; uploadId: number }[];
}

export interface ResponseJobTagDto extends DatabaseEntity {
  id: number;
  label: string;
}

export interface CreateJobTagDto {
  label: string;
}

export interface ResponseJobCatgeoryDto extends DatabaseEntity {
  id: number;
  label: string;
}

export interface CreateJobCategoryDto {
  label: string;
}

export interface UpdateJobTagDto extends Partial<CreateJobTagDto> {}

export interface ResponseJobUploadDto extends DatabaseEntity {
  id: number;
  jobId: string;
  job: ResponseJobDto;
  uploadId: number;
  upload: Upload;
  order: number;
}
export interface ResponseJobCategoryDto extends DatabaseEntity {
  id: number;
  label: string;
}
