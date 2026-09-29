import React from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActionSheetRef } from "react-native-actions-sheet";
import {
  CheckCircle2,
  Flag,
  MessageCircle,
  PauseCircle,
  Play,
  PlayCircle,
  Star,
  Telescope,
  User,
  LucideIcon,
} from "lucide-react-native";
import { Text } from "@reborn/mobile-ui";
import { Badge } from "@reborn/mobile-ui";
import { Button } from "@reborn/mobile-ui";
import { ActionPressable } from "@reborn/mobile-components";
import { Loader } from "@reborn/mobile-components";
import { useJob } from "@/hooks/content/job/useJob";
import { useWorkflowJob } from "@/hooks/content/job/workflow/useWorkflowJob";
import { useJobLifecycleTransition } from "@/hooks/content/job/workflow/useJobLifecycleTransition";
import { JobEvents } from "@/types";
import { cn } from "@reborn/lib";
import { identifyUser } from "@/lib/user.utils";
import {
  getAvailableLifecycleEvents,
  getWorkerGuidanceKey,
  getWorkerStepIndex,
  splitWorkerEvents,
  WORKER_STEPS,
} from "@/lib/job-lifecycle";
import { JobLifecycleActionSheet } from "./JobLifecycleActionSheet";

interface JobWorkPortalProps {
  id: string;
  className?: string;
}

const WORKER_EVENT_ICONS: Partial<Record<JobEvents, LucideIcon>> = {
  [JobEvents.ACCEPT_CANDIDATE]: CheckCircle2,
  [JobEvents.START]: Play,
  [JobEvents.FINISH]: Flag,
  [JobEvents.HOLD]: PauseCircle,
  [JobEvents.STOP_HOLD]: PlayCircle,
  [JobEvents.WORKER_REVIEW]: Star,
};

export const JobWorkPortal = ({ id, className }: JobWorkPortalProps) => {
  const { t } = useTranslation("jobs");
  const sheetRef = React.useRef<ActionSheetRef>(null);
  const [pendingEvent, setPendingEvent] = React.useState<JobEvents | null>(
    null,
  );

  const { job, isJobPending, refetchJob } = useJob({
    id,
    join: ["postedBy", "worker", "currency"],
  });
  const { workflowStatus, nextSteps, isjobWorkflowPending } = useWorkflowJob({
    id,
    enabled: !!id,
  });
  const { runEvent, isPending } = useJobLifecycleTransition(id);

  const currentStatus = workflowStatus ?? job?.status;
  const availableEvents = getAvailableLifecycleEvents({
    nextStepLabels: nextSteps.map((step) => step.label),
    role: "worker",
    workerId: job?.workerId,
  });
  const { primary, secondary } = splitWorkerEvents(availableEvents);
  const guidanceKey = getWorkerGuidanceKey(currentStatus);
  const currentStepIndex = getWorkerStepIndex(currentStatus);
  const clientName = identifyUser(job?.postedBy);

  const openConfirm = (event: JobEvents) => {
    setPendingEvent(event);
    sheetRef.current?.show();
  };

  if ((isjobWorkflowPending || isJobPending) && !job) {
    return <Loader className="flex-1 justify-center items-center" />;
  }

  return (
    <ScrollView
      className={cn("flex-1 bg-background", className)}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-4 pt-4 gap-3">
        <View className="rounded-2xl border border-border bg-card p-4 gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("management.work.assignment")}
            </Text>
            {currentStatus ? (
              <Badge variant="outline" className="px-3 py-1">
                <Text className="text-xs font-semibold">
                  {t(`management.lifecycle.status.${currentStatus}`)}
                </Text>
              </Badge>
            ) : null}
          </View>

          <Text className="text-base font-semibold text-foreground">
            {t("management.work.client", { name: clientName })}
          </Text>
          {job?.price != null ? (
            <Text className="text-sm text-muted-foreground">
              {t("management.work.budget", {
                amount: job.price,
                currency: job.currency?.label || "TND",
              })}
            </Text>
          ) : null}

          <View className="rounded-xl bg-muted/50 p-3">
            <Text className="text-sm text-foreground">
              {t(`management.work.guidance.${guidanceKey}`)}
            </Text>
          </View>

          {primary ? (
            <Button
              className="w-full rounded-xl"
              disabled={isPending}
              onPress={() => openConfirm(primary)}
            >
              <Text className="font-semibold">
                {t(`management.lifecycle.events.${primary}.title`)}
              </Text>
            </Button>
          ) : null}
        </View>

        {secondary.length > 0 ? (
          <View className="rounded-2xl border border-border bg-card overflow-hidden">
            <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-4 pt-4 pb-2">
              {t("management.work.otherActions")}
            </Text>
            {secondary.map((event, index) => (
              <ActionPressable
                key={event}
                title={t(`management.lifecycle.events.${event}.title`)}
                description={t(
                  `management.lifecycle.events.${event}.description`,
                )}
                IconComp={WORKER_EVENT_ICONS[event] ?? PauseCircle}
                onPress={() => openConfirm(event)}
                disabled={isPending}
                isLast={index === secondary.length - 1}
                classNames={{ wrapper: "p-4", icon: "bg-amber-500/10" }}
              />
            ))}
          </View>
        ) : null}

        <View className="rounded-2xl border border-border bg-card p-4">
          <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            {t("management.work.yourProgress")}
          </Text>
          {WORKER_STEPS.map((step, index) => {
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
                  {index < WORKER_STEPS.length - 1 ? (
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
                  {t(`management.work.steps.${step}`)}
                </Text>
              </View>
            );
          })}
        </View>

        <View className="rounded-2xl border border-border bg-card overflow-hidden mb-8">
          <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-4 pt-4 pb-2">
            {t("management.work.shortcuts")}
          </Text>
          <ActionPressable
            title={t("management.work.viewListing")}
            description={t("management.work.viewListingDescription")}
            IconComp={Telescope}
            onPress={() =>
              router.push({
                pathname: "/main/explore/job-details",
                params: { id },
              })
            }
            classNames={{ wrapper: "p-4", icon: "bg-primary/10" }}
          />
          {job?.postedById || job?.postedBy?.id ? (
            <ActionPressable
              title={t("management.work.viewClient")}
              description={t("management.work.viewClientDescription")}
              IconComp={User}
              onPress={() =>
                router.push({
                  pathname: "/main/explore/inspect-profile",
                  params: { id: job.postedById ?? job.postedBy?.id },
                })
              }
              classNames={{ wrapper: "p-4", icon: "bg-primary/10" }}
            />
          ) : null}
          <ActionPressable
            title={t("management.work.messageClient")}
            description={t("management.work.messageClientDescription")}
            IconComp={MessageCircle}
            isLast
            onPress={() => router.push("/main/(tabs)/chat")}
            classNames={{ wrapper: "p-4", icon: "bg-primary/10" }}
          />
        </View>
      </View>

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
        IconComp={
          pendingEvent
            ? (WORKER_EVENT_ICONS[pendingEvent] ?? CheckCircle2)
            : CheckCircle2
        }
        isPending={isPending}
        onClose={() => {
          sheetRef.current?.hide();
          setPendingEvent(null);
        }}
        onConfirm={() => {
          if (!pendingEvent) return;
          runEvent(pendingEvent).finally(() => {
            sheetRef.current?.hide();
            setPendingEvent(null);
            refetchJob();
          });
        }}
      />
    </ScrollView>
  );
};
