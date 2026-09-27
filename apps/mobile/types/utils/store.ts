import { DatabaseEntity } from "./database-entity";

export interface Store extends DatabaseEntity {
  id: string;
  description: string;
  value: any;
}

export enum StoreIDs {
  CORE = "core",
  FAQS = "faqs",
}
