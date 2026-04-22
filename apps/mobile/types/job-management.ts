import { ResponseRefParamDto } from "./reference-types";
import { Upload } from "./upload";
import { ResponseUserDto } from "./user-management";
import { DatabaseEntity } from "./utils";

export interface ResponseJobDto extends DatabaseEntity {
  id: string;
  title: string;
  description: string;
  price: number;
  postedBy: ResponseUserDto;
  postedById: string;
  tags: ResponseJobTagDto[];
  categoryId: number;
  style: JobStyle;
  difficulty: JobDifficulty;
  uploads: ResponseJobUploadDto[];
  currencyId: number;
  currency: ResponseRefParamDto;
}
export interface CreateJobDto {
  title: string;
  description: string;
  location?: string;
  price: number;
  tagIds: number[];
  currencyId?: number;
  categoryId?: number;
  style?: JobStyle;
  difficulty?: JobDifficulty;
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

export enum JobDifficulty {
  ENTRY_LEVEL = "Entry Level",
  MID_LEVEL = "Mid Level",
  SENIOR_LEVEL = "Senior Level",
  INTERN = "Internship",
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

export enum JobRequestStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export interface ResponseJobRequestDto extends DatabaseEntity {
  id: number;
  jobId: string;
  job?: ResponseJobDto;
  userId: string;
  user?: ResponseUserDto;
  status: JobRequestStatus;
}

export interface CreateJobRequestDto {
  jobId: string;
}

export interface UpdateJobRequestDto extends Partial<CreateJobRequestDto> {}

export interface ResponseJobSaveDto extends DatabaseEntity {
  id: string;
  jobId: string;
  job?: ResponseJobDto;
  userId: string;
  user?: ResponseUserDto;
}

export interface CreateJobSaveDto {
  jobId: string;
}

export interface ResponseJobViewDto extends DatabaseEntity {
  id: string;
  jobId: string;
  job?: ResponseJobDto;
  userId: string;
  user?: ResponseUserDto;
}

export interface CreateJobViewDto {
  jobId: string;
}
