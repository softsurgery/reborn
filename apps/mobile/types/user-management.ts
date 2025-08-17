import { ResponseRegionDto } from "./content";
import { Upload } from "./upload";
import { DatabaseEntity } from "./utils/database-entity";

export interface ResponseClientDto extends DatabaseEntity {
  id: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  username: string;
  email: string;
  emailVerified?: Date;
  profile: ResponseProfileDto;
  profileId: string;
}

export interface UpdateClientDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  password?: string;
  email: string;
  profile?: UpdateProfileDto;
}

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export interface ResponseProfileDto extends DatabaseEntity {
  id: number;
  phone?: string;
  cin?: string;
  bio?: string;
  gender?: Gender;
  isPrivate?: boolean;
  region?: ResponseRegionDto;
  regionId?: number;
  user: ResponseClientDto;
  pictureId?: number;
  picture?: Upload;
}

export class UpdateProfileDto {
  phone?: string;
  cin?: string;
  bio?: string;
  gender?: Gender;
  isPrivate?: boolean;
  regionId?: number;
  pictureId?: number;
}
