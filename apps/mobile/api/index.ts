import { auth } from "./auth";
import { feedback } from "./feedback";
import { bug } from "./bug";
import { client } from "./client";
import { follow } from "./follow";
import { upload } from "./upload";
import { _public } from "./public";
import { job } from "./job";
import { store } from "./store";
import { jobCategory } from "./job-category";
import { jobTag } from "./job-tag";
import { jobRequest } from "./job-request";
import { chat } from "./chat";
import { jobSave } from "./job-save";

export const api = {
  auth,
  _public,
  feedback,
  bug,
  client,
  follow,
  upload,
  job,
  jobCategory,
  jobRequest,
  jobSave,
  jobTag,
  store,
  chat,
};
