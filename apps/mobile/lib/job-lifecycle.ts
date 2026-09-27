import { JobEvents, JobStatus } from "@/types";

export type JobLifecycleRole = "client" | "worker" | "other";

export const WORKER_STEPS: JobStatus[] = [
  JobStatus.CANDIDATE_PENDING,
  JobStatus.NOT_STARTED,
  JobStatus.PENDING,
  JobStatus.FINISHED,
  JobStatus.REVIEWED_BY_WORKER,
  JobStatus.REVIEWED_BY_WORKER_AND_CLIENT,
  JobStatus.SUCCESSFUL,
];

const WORKER_PRIMARY_EVENTS: JobEvents[] = [
  JobEvents.ACCEPT_CANDIDATE,
  JobEvents.START,
  JobEvents.STOP_HOLD,
  JobEvents.FINISH,
  JobEvents.WORKER_REVIEW,
];

export const LIFECYCLE_STEPS: JobStatus[] = [
  JobStatus.DRAFT,
  JobStatus.POSTED,
  JobStatus.CANDIDATE_PENDING,
  JobStatus.NOT_STARTED,
  JobStatus.PENDING,
  JobStatus.FINISHED,
  JobStatus.REVIEWED_BY_WORKER,
  JobStatus.REVIEWED_BY_WORKER_AND_CLIENT,
  JobStatus.SUCCESSFUL,
  JobStatus.ARCHIVED,
];

const CLIENT_LIFECYCLE_EVENTS: JobEvents[] = [
  JobEvents.CHOOSE_CANDIDATE,
  JobEvents.REFUSE_CANDIDATE,
  JobEvents.STOP_HOLD,
  JobEvents.MARK_FAILED,
  JobEvents.CLIENT_REVIEW,
  JobEvents.MARK_SUCCESSFUL,
  JobEvents.ARCHIVE,
];

const WORKER_LIFECYCLE_EVENTS: JobEvents[] = [
  JobEvents.ACCEPT_CANDIDATE,
  JobEvents.START,
  JobEvents.FINISH,
  JobEvents.HOLD,
  JobEvents.STOP_HOLD,
  JobEvents.WORKER_REVIEW,
];

export const getJobLifecycleRole = ({
  userId,
  postedById,
  workerId,
}: {
  userId?: string | null;
  postedById?: string | null;
  workerId?: string | null;
}): JobLifecycleRole => {
  if (userId && postedById && userId === postedById) return "client";
  if (userId && workerId && userId === workerId) return "worker";
  return "other";
};

export const getAvailableLifecycleEvents = ({
  nextStepLabels,
  role,
  workerId,
}: {
  nextStepLabels: string[];
  role: JobLifecycleRole;
  workerId?: string | null;
}): JobEvents[] => {
  const allowed =
    role === "client"
      ? CLIENT_LIFECYCLE_EVENTS
      : role === "worker"
        ? WORKER_LIFECYCLE_EVENTS
        : [];

  return allowed.filter((event) => {
    if (!nextStepLabels.includes(event)) return false;
    if (event === JobEvents.CHOOSE_CANDIDATE && !workerId) return false;
    return true;
  });
};

export const getLifecycleWaitingKey = ({
  status,
  role,
  hasActions,
}: {
  status?: string | null;
  role: JobLifecycleRole;
  hasActions: boolean;
}): string | null => {
  if (hasActions) return null;

  switch (status) {
    case JobStatus.CANDIDATE_PENDING:
      return role === "client" ? "waiting.workerAccept" : null;
    case JobStatus.NOT_STARTED:
      return role === "client" ? "waiting.workerStart" : null;
    case JobStatus.PENDING:
      return role === "client" ? "waiting.workerFinish" : null;
    case JobStatus.FINISHED:
      return role === "client" ? "waiting.workerReview" : null;
    case JobStatus.REVIEWED_BY_WORKER:
      return role === "worker" ? "waiting.clientReview" : null;
    case JobStatus.REVIEWED_BY_WORKER_AND_CLIENT:
      return role === "worker" ? "waiting.clientSuccess" : null;
    case JobStatus.ON_HOLD:
      return "waiting.onHold";
    case JobStatus.SUCCESSFUL:
      return "waiting.successful";
    case JobStatus.FAILED:
      return "waiting.failed";
    case JobStatus.ARCHIVED:
      return "waiting.archived";
    default:
      return null;
  }
};

export const getLifecycleStepIndex = (status?: string | null) => {
  if (status === JobStatus.ON_HOLD) {
    return LIFECYCLE_STEPS.indexOf(JobStatus.PENDING);
  }
  if (status === JobStatus.FAILED) {
    return LIFECYCLE_STEPS.indexOf(JobStatus.PENDING);
  }
  return LIFECYCLE_STEPS.findIndex((step) => step === status);
};

export const getWorkerStepIndex = (status?: string | null) => {
  if (status === JobStatus.ON_HOLD) {
    return WORKER_STEPS.indexOf(JobStatus.PENDING);
  }
  if (status === JobStatus.FAILED || status === JobStatus.ARCHIVED) {
    return WORKER_STEPS.indexOf(JobStatus.SUCCESSFUL);
  }
  return WORKER_STEPS.findIndex((step) => step === status);
};

export const getWorkerGuidanceKey = (status?: string | null) => {
  switch (status) {
    case JobStatus.CANDIDATE_PENDING:
      return "accept";
    case JobStatus.NOT_STARTED:
      return "start";
    case JobStatus.PENDING:
      return "progress";
    case JobStatus.ON_HOLD:
      return "hold";
    case JobStatus.FINISHED:
      return "review";
    case JobStatus.REVIEWED_BY_WORKER:
      return "waitClientReview";
    case JobStatus.REVIEWED_BY_WORKER_AND_CLIENT:
      return "waitSuccess";
    case JobStatus.SUCCESSFUL:
      return "done";
    case JobStatus.FAILED:
      return "failed";
    case JobStatus.ARCHIVED:
      return "archived";
    default:
      return "generic";
  }
};

export const splitWorkerEvents = (events: JobEvents[]) => {
  const primary =
    WORKER_PRIMARY_EVENTS.find((event) => events.includes(event)) ??
    events[0] ??
    null;
  return {
    primary,
    secondary: events.filter((event) => event !== primary),
  };
};
