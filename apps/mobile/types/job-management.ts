import { Upload } from "./upload";
import { ResponseClientDto } from "./user-management";
import { DatabaseEntity } from "./utils";

export interface ResponseJobDto extends DatabaseEntity {
  id: string;
  title: string;
  description: string;
  price: number;
  postedBy: ResponseClientDto;
  postedById: string;
  tags: ResponseJobTagDto[];
  categoryId: number;
  style: JobStyle;
  uploads: ResponseJobUploadDto[];
}
export interface CreateJobDto {
  title: string;
  description: string;
  price: number;
  tagIds: number[];
  currencyId?: string;
  categoryId?: number;
  style?: JobStyle;
  uploads?: { uploadId: number }[];
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
  uploads?: { id: number; uploadId: number }[];
}

export interface ResponseJobMetadataDto {
  id: string;
  requestCount: number;
  paymentVerified: boolean;
  reviewCount: number;
  rating: number;
  hireRate: number;
}

export interface ResponseJobTagDto extends DatabaseEntity {
  id: number;
  label: string;
}

export interface ResponseJobCatgeoryDto extends DatabaseEntity {
  id: number;
  label: string;
}

export interface CreateJobCategoryDto {
  label: string;
}

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

export enum JobStyle {
  REMOTE = "Remote",
  ONSITE = "On-site",
  FLEXIBLE = "Flexible Hours",
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  FREELANCE = "Freelance",
  WEEKEND = "Weekend Job",
  NIGHT = "Night Shift",
  DAY = "Day Shift",
}

export interface ResponseJobRequestDto extends DatabaseEntity {
  id: number;
  jobId: string;
  job?: ResponseJobDto;
  userId: string;
  user?: ResponseClientDto;
  status: JobRequestStatus;
}

export enum JobRequestStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export interface CreateJobRequestDto {
  jobId: string;
}

export interface UpdateJobRequestDto extends Partial<CreateJobRequestDto> {}
