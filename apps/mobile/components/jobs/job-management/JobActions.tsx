import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { ActionSheetRef } from "react-native-actions-sheet";
import { ActionPressable } from "@/components/shared/ActionPressable";
import { DuplicateJobActionSheet } from "./DuplicateJobActionSheet";
import { ArchiveJobActionSheet } from "./ArchiveJobActionSheet";
import { DeleteJobActionSheet } from "./DeleteJobActionSheet";
import { PauseJobActionSheet } from "./PauseJobActionSheet";
import { useNextWorkflowJob } from "@/hooks/content/job/workflow/useNextWorkflowJob";
import { JobEvents, JobStatus } from "@/types";
import { useJob } from "@/hooks/content/job/useJob";
import {
  Edit,
  Share2,
  PauseCircle,
  Copy,
  Download,
  Mail,
  Calendar,
  Link,
  Archive,
  X,
} from "lucide-react-native";
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";
import { useDuplicateJob } from "@/hooks/content/job/useDuplicateJob";
import { useDeleteJob } from "@/hooks/content/job/useDeleteJob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner-native";
import { useTranslation } from "react-i18next";

type ActionItem = {
  id: string;
  title: string;
  description: string;
  Icon: any;
  iconBgClass: string;
  titleClass?: string;
  activeBgClass?: string;
  onPress?: () => void;
  disabled?: boolean;
};

type ActionGroup = {
  id: string;
  title: string;
  containerClass?: string;
  titleClass?: string;
  items: ActionItem[];
};

interface JobActionsProps {
  id: string;
  className?: string;
}

export const JobActions = ({ id, className }: JobActionsProps) => {
  const { t } = useTranslation("jobs");
  const router = useRouter();
  const { duplicateJob, isDuplicatingJob } = useDuplicateJob();
  const { deleteJob, isDeletingJob } = useDeleteJob();
  const duplicateSheetRef = React.useRef<ActionSheetRef>(null);
  const archiveSheetRef = React.useRef<ActionSheetRef>(null);
  const deleteSheetRef = React.useRef<ActionSheetRef>(null);
  const pauseSheetRef = React.useRef<ActionSheetRef>(null);
  const queryClient = useQueryClient();

  const { job, refetchJob } = useJob({ id });

  const { mutate: togglePauseJob, isPending: isTogglePausePending } =
    useMutation({
      mutationFn: (pauseStatus: boolean) => {
        if (pauseStatus) {
          return api.job.pause(id);
        } else {
          return api.job.unpause(id);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        queryClient.invalidateQueries({ queryKey: ["job", id] });
        refetchJob();
      },
      onError: (error: any) => {
        toast.error(
          t("management.actions.errors.updateStatus", {
            message:
              error.response?.data?.message ||
              t("management.actions.errors.unknown"),
          }),
        );
      },
    });

  const { nextJobWorkflow, isNextJobWorkflowPending } = useNextWorkflowJob({
    id,
    onSuccess: () => {
      refetchJob();
      archiveSheetRef.current?.hide();
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const canArchive =
    job?.status === JobStatus.DRAFT ||
    job?.status === JobStatus.FAILED ||
    job?.status === JobStatus.SUCCESSFUL;

  const canDelete = job?.status === JobStatus.DRAFT;

  const ACTION_GROUPS: ActionGroup[] = [
    {
      id: "core-actions",
      title: t("management.actions.groups.core"),
      items: [
        {
          id: "edit",
          title: t("management.actions.items.edit.title"),
          description: t("management.actions.items.edit.description"),
          Icon: Edit,
          iconBgClass: "bg-blue-500/10",
          onPress: () => {
            router.push({
              pathname: "/main/my-space/update-job",
              params: { id },
            });
          },
        },
        {
          id: "duplicate",
          title: t("management.actions.items.duplicate.title"),
          description: t("management.actions.items.duplicate.description"),
          Icon: Copy,
          iconBgClass: "bg-purple-500/10",
          onPress: () => {
            duplicateSheetRef.current?.show();
          },
        },
        {
          id: "pause",
          title: job?.pausedApplication
            ? t("management.actions.items.resume.title")
            : t("management.actions.items.pause.title"),
          description: job?.pausedApplication
            ? t("management.actions.items.resume.description")
            : t("management.actions.items.pause.description"),
          Icon: PauseCircle,
          iconBgClass: job?.pausedApplication
            ? "bg-emerald-500/10"
            : "bg-amber-500/10",
          onPress: () => {
            pauseSheetRef.current?.show();
          },
          disabled: isTogglePausePending,
        },
      ],
    },
    {
      id: "pipeline-tools",
      title: t("management.actions.groups.pipeline"),
      items: [
        {
          id: "export",
          title: t("management.actions.items.export.title"),
          description: t("management.actions.items.export.description"),
          Icon: Download,
          iconBgClass: "bg-emerald-500/10",
        },
        {
          id: "broadcast",
          title: t("management.actions.items.broadcast.title"),
          description: t("management.actions.items.broadcast.description"),
          Icon: Mail,
          iconBgClass: "bg-sky-500/10",
        },
        {
          id: "interview",
          title: t("management.actions.items.interview.title"),
          description: t("management.actions.items.interview.description"),
          Icon: Calendar,
          iconBgClass: "bg-indigo-500/10",
        },
      ],
    },
    {
      id: "distribution",
      title: t("management.actions.groups.distribution"),
      items: [
        {
          id: "copy-link",
          title: t("management.actions.items.copyLink.title"),
          description: t("management.actions.items.copyLink.description"),
          Icon: Link,
          iconBgClass: "bg-primary/10",
        },
        {
          id: "share-social",
          title: t("management.actions.items.shareSocial.title"),
          description: t("management.actions.items.shareSocial.description"),
          Icon: Share2,
          iconBgClass: "bg-primary/10",
        },
      ],
    },
    {
      id: "danger-zone",
      title: t("management.actions.groups.danger"),
      containerClass: "border-destructive/30 mb-6",
      titleClass: "text-destructive",
      items: [
        {
          id: "archive",
          title: t("management.actions.items.archive.title"),
          description: canArchive
            ? t("management.actions.items.archive.description")
            : t("management.actions.items.archive.disabledDescription"),
          Icon: Archive,
          iconBgClass: "bg-muted",
          activeBgClass: "active:bg-destructive/10",
          disabled: !canArchive,
          onPress: () => {
            archiveSheetRef.current?.show();
          },
        },
        {
          id: "delete",
          title: t("management.actions.items.delete.title"),
          description: canDelete
            ? t("management.actions.items.delete.description")
            : t("management.actions.items.delete.disabledDescription"),
          Icon: X,
          iconBgClass: "bg-destructive",
          titleClass: "text-destructive font-bold",
          activeBgClass: "active:bg-destructive",
          disabled: !canDelete,
          onPress: () => {
            deleteSheetRef.current?.show();
          },
        },
      ],
    },
  ];

  return (
    <ScrollView
      className={cn("flex-1 bg-background", className)}
      showsVerticalScrollIndicator={false}
    >
      {/* Featured / Sponsor Banner */}
      {/* <TouchableOpacity className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/30 rounded-2xl p-4 mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3.5 flex-1">
          <View className="w-10 h-10 rounded-xl bg-primary/20 items-center justify-center">
            <Rocket size={20} color={palette.foreground} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground font-bold text-sm">
              Boost Listing Reach
            </Text>
            <Text className="text-muted-foreground text-xs">
              Get up to 3x more views by featuring this job
            </Text>
          </View>
        </View>
        <ChevronRight size={18} color={palette.foreground} />
      </TouchableOpacity> */}

      {/* Action Groups */}
      {ACTION_GROUPS.map((group) => (
        <View
          key={group.id}
          className={cn(
            "overflow-hidden",
            group.containerClass || "border-border mb-4",
          )}
        >
          <Text
            className={`text-xs font-bold uppercase tracking-wider px-5 pt-4 pb-2 ${
              group.titleClass || "text-muted-foreground"
            }`}
          >
            {group.title}
          </Text>

          {group.items.map((item, index) => {
            const isLast = index === group.items.length - 1;
            return (
              <ActionPressable
                key={item.id}
                title={item.title}
                description={item.description}
                IconComp={item.Icon}
                onPress={item.onPress}
                disabled={item.disabled}
                isLast={isLast}
                classNames={{
                  wrapper: "p-4",
                  icon: item.iconBgClass,
                  title: item.titleClass,
                }}
              />
            );
          })}
        </View>
      ))}

      <DuplicateJobActionSheet
        ref={duplicateSheetRef}
        isPending={isDuplicatingJob}
        onClose={() => duplicateSheetRef.current?.hide()}
        onConfirm={async () => {
          try {
            const duplicatedJob = await duplicateJob(id);
            duplicateSheetRef.current?.hide();
            if (duplicatedJob?.id) {
              router.push({
                pathname: "/main/my-space/update-job",
                params: { id: duplicatedJob.id },
              });
            }
          } catch (e) {
            console.error(e);
          }
        }}
      />
      <ArchiveJobActionSheet
        ref={archiveSheetRef}
        isPending={isNextJobWorkflowPending}
        onClose={() => archiveSheetRef.current?.hide()}
        onConfirm={() => {
          nextJobWorkflow(JobEvents.ARCHIVE);
        }}
      />
      <DeleteJobActionSheet
        ref={deleteSheetRef}
        isPending={isDeletingJob}
        onClose={() => deleteSheetRef.current?.hide()}
        onConfirm={async () => {
          try {
            await deleteJob(id);
            deleteSheetRef.current?.hide();
            router.back();
          } catch (e) {
            console.error(e);
          }
        }}
      />
      <PauseJobActionSheet
        ref={pauseSheetRef}
        isPending={isTogglePausePending}
        isPaused={!!job?.pausedApplication}
        onClose={() => pauseSheetRef.current?.hide()}
        onConfirm={() => {
          togglePauseJob(!job?.pausedApplication);
          pauseSheetRef.current?.hide();
        }}
      />
    </ScrollView>
  );
};
