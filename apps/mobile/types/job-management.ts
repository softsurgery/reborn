import { ResponseRefParamDto } from "./reference-types";
import { Upload } from "./upload";
import { ResponseUserDto } from "./user-management";
import { DatabaseEntity } from "./utils";
import { ResponseWorkflowDto } from "./utils/workflow";

export enum JobEvents {
  POST = "Post",
  UNPUBLISH = "Unpublish",
  CHOOSE_CANDIDATE = "Choose Candidate",
  REFUSE_CANDIDATE = "Refuse Candidate",
  ACCEPT_CANDIDATE = "Accept Candidate",
  START = "Start",
  FINISH = "Finish",
  WORKER_REVIEW = "Worker Review",
  CLIENT_REVIEW = "Client Review",
  MARK_SUCCESSFUL = "Mark Successful",
  HOLD = "Hold",
  STOP_HOLD = "Stop Hold",
  MARK_FAILED = "Mark Failed",
  ARCHIVE = "Archive",
}

export enum JobStatus {
  DRAFT = "Draft",
  POSTED = "Posted",
  CANDIDATE_PENDING = "Candidate Pending",
  NOT_STARTED = "Not Started",
  PENDING = "Pending",
  FINISHED = "Finished",
  ON_HOLD = "On Hold",
  REVIEWED_BY_WORKER = "Reviewed By Worker",
  REVIEWED_BY_WORKER_AND_CLIENT = "Reviewed By Worker & Client",
  FAILED = "Failed",
  SUCCESSFUL = "Successfull",
  ARCHIVED = "Archived",
  DELETED = "Deleted",
}

// Job *************************************************************
export interface ResponseJobDto extends DatabaseEntity {
  id: string;
  status: JobStatus;
  title: string;
  description: string;

  price: number;
  pricingType: JobPricingType;
  currencyId: number;
  currency: ResponseRefParamDto;

  longitude: number;
  latitude: number;

  postedBy: ResponseUserDto;
  postedById: string;

  tags: ResponseRefParamDto[];
  categoryId: number;
  category: ResponseRefParamDto;

  style: JobStyle;
  difficulty: JobDifficulty;

  uploads: ResponseJobUploadDto[];
}

export interface CreateJobDto {
  title: string;
  status: "Draft" | "Posted";
  description: string;
  price?: number;
  pricingType?: JobPricingType;
  tagIds: number[];
  currencyId?: number;
  categoryId?: number;
  style?: JobStyle;
  difficulty?: JobDifficulty;
  uploads?: { uploadId: number }[];
  longitude?: number;
  latitude?: number;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
  uploads?: { id: number; uploadId: number; order: number }[];
}

export interface ResponseJobWorkflowDto extends ResponseWorkflowDto {
  job: ResponseJobDto;
}

export interface ResponseJobMetadataDto {
  id: string;
  requestCount: number;
  paymentVerified: boolean;
  reviewCount: number;
  rating: number;
  hireRate: number;
}

export interface ResponseJobUploadDto extends DatabaseEntity {
  id: number;
  jobId: string;
  job: ResponseJobDto;
  uploadId: number;
  upload: Upload;
  order: number;
}

// Job Request *************************************************************

export interface ResponseJobRequestDto extends DatabaseEntity {
  id: number;
  jobId: string;
  job?: ResponseJobDto;
  userId: string;
  user?: ResponseUserDto;
  status: JobRequestStatus;
  message?: string;
  proposedPrice?: number;
}

export interface CreateJobRequestDto {
  jobId: string;
  message?: string;
  proposedPrice?: number;
}

export interface UpdateJobRequestDto extends Partial<CreateJobRequestDto> {}

// Job View *************************************************************

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

// Job View *************************************************************

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

// enums *************************************************************

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

export enum JobPricingType {
  FIXED = "fixed",
  HOURLY = "hourly",
}
