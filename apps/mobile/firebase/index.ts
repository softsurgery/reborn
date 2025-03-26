import { bugService } from "./bug-report";
import { feedbackService } from "./feedback";
export * from "./bug-report";

import { user } from "./user";
export * from "./user";

import { chat } from "./chat";
export * from "./chat";

export const firebaseFns = { user, bugService, feedbackService, chat };
