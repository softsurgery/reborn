import { DatabaseEntity } from "../utils/database-entity";

export interface ResponseRegionDto extends DatabaseEntity {
  id: number;
  label: string;
}
