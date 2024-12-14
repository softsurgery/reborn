import { bugService } from "./bug-report";
export * from "./bug-report";

import { user } from "./user";
export * from "./user";

export const firebaseFns = { user, bugService };
