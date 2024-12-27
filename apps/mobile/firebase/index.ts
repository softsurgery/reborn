import { bugService } from "./bug-report";
import { feedbackService } from "./feedback";
export * from "./bug-report";

import { user } from "./user";
export * from "./user";

export const firebaseFns = { user, bugService, feedbackService };
