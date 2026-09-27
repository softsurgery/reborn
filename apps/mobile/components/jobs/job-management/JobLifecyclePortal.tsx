import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { ActionPressable } from "@/components/shared/ActionPressable";
import { Loader } from "@/components/shared/lotties/Loader";
import { useWorkflowJob } from "@/hooks/content/job/workflow/useWorkflowJob";
import { useNextWorkflowJob } from "@/hooks/content/job/workflow/useNextWorkflowJob";
import { useJob } from "@/hooks/content/job/useJob";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner-native";
import { ActionSheetRef } from "react-native-actions-sheet";
import { JobEvents, ServerErrorResponse } from "@/types";
import { cn } from "@/lib/utils";
import { identifyUser } from "@/lib/user.utils";
import {
  getAvailableLifecycleEvents,
  getJobLifecycleRole,
  getLifecycleStepIndex,
  getLifecycleWaitingKey,
  LIFECYCLE_STEPS,
} from "@/lib/job-lifecycle";
import { JobLifecycleActionSheet } from "./JobLifecycleActionSheet";
import {
  CheckCircle2,
  Flag,
  PauseCircle,
  Play,
  PlayCircle,
  Star,
  Trophy,
  UserCheck,
  UserX,
  XCircle,
  Archive,
  LucideIcon,
} from "lucide-react-native";

interface JobLifecyclePortalProps {
  id: string;
  className?: string;
}

const EVENT_ICONS: Record<JobEvents, LucideIcon> = {
  [JobEvents.POST]: Play,
  [JobEvents.UNPUBLISH]: PauseCircle,
  [JobEvents.CHOOSE_CANDIDATE]: UserCheck,
  [JobEvents.REFUSE_CANDIDATE]: UserX,
  [JobEvents.ACCEPT_CANDIDATE]: CheckCircle2,
  [JobEvents.START]: Play,
  [JobEvents.FINISH]: Flag,
  [JobEvents.HOLD]: PauseCircle,
  [JobEvents.STOP_HOLD]: PlayCircle,
  [JobEvents.MARK_FAILED]: XCircle,
  [JobEvents.WORKER_REVIEW]: Star,
  [JobEvents.CLIENT_REVIEW]: Star,
  [JobEvents.MARK_SUCCESSFUL]: Trophy,
  [JobEvents.ARCHIVE]: Archive,
};

const DESTRUCTIVE_EVENTS = new Set<JobEvents>([
  JobEvents.REFUSE_CANDIDATE,
  JobEvents.MARK_FAILED,
]);

export const JobLifecyclePortal = ({
  id,
  className,
}: JobLifecyclePortalProps) => {
  const { t } = useTranslation("jobs");
  const queryClient = useQueryClient();
  const sheetRef = React.useRef<ActionSheetRef>(null);
  const [pendingEvent, setPendingEvent] = React.useState<JobEvents | null>(
    null,
  );

  const { currentUser } = useCurrentUser();
  const { job, refetchJob } = useJob({
    id,
    join: ["postedBy", "worker"],
  });
  const {
    workflowStatus,
    nextSteps,
    isjobWorkflowPending,
    refetchJobWorkflow,
  } = useWorkflowJob({ id, enabled: !!id });

  const invalidateLifecycle = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["job", id] });
    queryClient.invalidateQueries({ queryKey: ["job-workflow", id] });
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
    queryClient.invalidateQueries({ queryKey: ["job-metadata", id] });
    refetchJob();
    refetchJobWorkflow();
  }, [id, queryClient, refetchJob, refetchJobWorkflow]);

  const { nextJobWorkflow, isNextJobWorkflowPending } = useNextWorkflowJob({
    id,
    onSuccess: () => {
      sheetRef.current?.hide();
      setPendingEvent(null);
      invalidateLifecycle();
      toast.success(t("management.lifecycle.toast.success"));
    },
    onError: (error) => {
      const serverError = error as ServerErrorResponse;
      toast.error(
        serverError?.response?.data?.message ||
          t("management.actions.errors.unknown"),
      );
    },
  });

  const role = getJobLifecycleRole({
    userId: currentUser?.id,
    postedById: job?.postedById ?? job?.postedBy?.id,
    workerId: job?.workerId,
  });

  const availableEvents = getAvailableLifecycleEvents({
    nextStepLabels: nextSteps.map((step) => step.label),
    role,
    workerId: job?.workerId,
  });

  const waitingKey = getLifecycleWaitingKey({
    status: workflowStatus ?? job?.status,
    role,
    hasActions: availableEvents.length > 0,
  });

  const currentStatus = workflowStatus ?? job?.status;
  const currentStepIndex = getLifecycleStepIndex(currentStatus);

  const openConfirm = (event: JobEvents) => {
    setPendingEvent(event);
    sheetRef.current?.show();
  };

  if (isjobWorkflowPending && !job) {
    return <Loader className="flex-1 justify-center items-center" />;
  }

  return (
    <ScrollView
      className={cn("flex-1 bg-background", className)}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-4 pt-4 pb-2">
        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t("management.lifecycle.currentStatus")}
        </Text>
        <View className="flex-row items-center gap-2 mt-2">
          <Badge variant="outline" className="px-3 py-1">
            <Text className="text-sm font-semibold">
              {currentStatus
                ? t(`management.lifecycle.status.${currentStatus}`)
                : ""}
            </Text>
          </Badge>
        </View>
        {job?.worker ? (
          <Text className="text-sm text-muted-foreground mt-2">
            {t("management.lifecycle.assignedWorker", {
              name: identifyUser(job.worker),
            })}
          </Text>
        ) : null}
        <Text className="text-sm text-muted-foreground mt-1">
          {t(`management.lifecycle.role.${role}`)}
        </Text>
      </View>

      <View className="px-4 py-3">
        {LIFECYCLE_STEPS.map((step, index) => {
          const isCurrent = currentStepIndex === index;
          const isDone = currentStepIndex > index;
          return (
            <View key={step} className="flex-row gap-3">
              <View className="items-center">
                <View
                  className={cn(
                    "w-3 h-3 rounded-full mt-1",
                    isCurrent
                      ? "bg-primary"
                      : isDone
                        ? "bg-primary/50"
                        : "bg-border",
                  )}
                />
                {index < LIFECYCLE_STEPS.length - 1 ? (
                  <View
                    className={cn(
                      "w-px flex-1 min-h-5",
                      isDone ? "bg-primary/40" : "bg-border",
                    )}
                  />
                ) : null}
              </View>
              <Text
                className={cn(
                  "text-sm pb-4",
                  isCurrent
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground",
                )}
              >
                {t(`management.lifecycle.status.${step}`)}
              </Text>
            </View>
          );
        })}
      </View>

      {waitingKey ? (
        <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="text-sm text-muted-foreground">
            {t(`management.lifecycle.${waitingKey}`)}
          </Text>
        </View>
      ) : null}

      {availableEvents.length > 0 ? (
        <View className="border-border mb-6">
          <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-5 pt-2 pb-2">
            {t("management.lifecycle.availableActions")}
          </Text>
          {availableEvents.map((event, index) => (
            <ActionPressable
              key={event}
              title={t(`management.lifecycle.events.${event}.title`)}
              description={t(`management.lifecycle.events.${event}.description`)}
              IconComp={EVENT_ICONS[event]}
              onPress={() => openConfirm(event)}
              disabled={isNextJobWorkflowPending}
              isLast={index === availableEvents.length - 1}
              classNames={{
                wrapper: "p-4",
                icon: DESTRUCTIVE_EVENTS.has(event)
                  ? "bg-destructive/10"
                  : "bg-primary/10",
                title: DESTRUCTIVE_EVENTS.has(event)
                  ? "text-destructive font-bold"
                  : undefined,
              }}
            />
          ))}
        </View>
      ) : null}

      <JobLifecycleActionSheet
        ref={sheetRef}
        title={
          pendingEvent
            ? t(`management.lifecycle.events.${pendingEvent}.title`)
            : t("management.common.confirm")
        }
        description={
          pendingEvent
            ? t(`management.lifecycle.events.${pendingEvent}.confirm`)
            : ""
        }
        IconComp={pendingEvent ? EVENT_ICONS[pendingEvent] : CheckCircle2}
        destructive={
          pendingEvent ? DESTRUCTIVE_EVENTS.has(pendingEvent) : false
        }
        isPending={isNextJobWorkflowPending}
        onClose={() => {
          sheetRef.current?.hide();
          setPendingEvent(null);
        }}
        onConfirm={() => {
          if (pendingEvent) {
            nextJobWorkflow(pendingEvent);
          }
        }}
      />
    </ScrollView>
  );
};
