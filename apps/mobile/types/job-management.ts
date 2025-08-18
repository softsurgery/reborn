import { ResponseClientDto } from "./user-management";
import { DatabaseEntity } from "./utils";

export interface ResponseJobDto extends DatabaseEntity {
  id: string;
  title: string;
  description: string;
  price: number;
  postedBy: ResponseClientDto;
}
export interface CreateJobDto {
  title: string;
  description: string;
  price: number;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}
