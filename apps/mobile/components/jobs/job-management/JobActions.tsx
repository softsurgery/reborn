import React, { useRef } from "react";
import { View, Text, ScrollView } from "react-native";
import { ActionSheetRef } from "react-native-actions-sheet";
import { ActionPressable } from "@/components/shared/ActionPressable";
import { DuplicateJobActionSheet } from "./DuplicateJobActionSheet";
import { ArchiveJobActionSheet } from "./ArchiveJobActionSheet";
import { DeleteJobActionSheet } from "./DeleteJobActionSheet";
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
import { useColorPalette } from "@/hooks/useColorPalette";
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";
import { useDuplicateJob } from "@/hooks/content/job/useDuplicateJob";
import { useDeleteJob } from "@/hooks/content/job/useDeleteJob";

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
  const { palette } = useColorPalette();
  const router = useRouter();
  const { duplicateJob, isDuplicatingJob } = useDuplicateJob();
  const { deleteJob, isDeletingJob } = useDeleteJob();
  const duplicateSheetRef = useRef<ActionSheetRef>(null);
  const archiveSheetRef = useRef<ActionSheetRef>(null);
  const deleteSheetRef = useRef<ActionSheetRef>(null);

  const { job, refetchJob } = useJob({ id });

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
      title: "Core Actions",
      items: [
        {
          id: "edit",
          title: "Edit Job Posting",
          description: "Update title, requirements & salary",
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
          title: "Duplicate Job",
          description: "Create a copy for a similar opening",
          Icon: Copy,
          iconBgClass: "bg-purple-500/10",
          onPress: () => {
            duplicateSheetRef.current?.show();
          },
        },
        {
          id: "pause",
          title: "Pause Applications",
          description: "Stop accepting new candidate submissions",
          Icon: PauseCircle,
          iconBgClass: "bg-amber-500/10",
        },
      ],
    },
    {
      id: "pipeline-tools",
      title: "Candidate Pipeline Tools",
      items: [
        {
          id: "export",
          title: "Export Applicants (CSV/PDF)",
          description: "Download full application database",
          Icon: Download,
          iconBgClass: "bg-emerald-500/10",
        },
        {
          id: "broadcast",
          title: "Broadcast Message",
          description: "Send updates to all 58 applicants",
          Icon: Mail,
          iconBgClass: "bg-sky-500/10",
        },
        {
          id: "interview",
          title: "Interview Batch Scheduler",
          description: "Set available calendar slots for interviews",
          Icon: Calendar,
          iconBgClass: "bg-indigo-500/10",
        },
      ],
    },
    {
      id: "distribution",
      title: "Distribution & Share",
      items: [
        {
          id: "copy-link",
          title: "Copy Direct Link",
          description: "Share custom referral or landing page link",
          Icon: Link,
          iconBgClass: "bg-primary/10",
        },
        {
          id: "share-social",
          title: "Share on Social Media",
          description: "Publish post to LinkedIn, X, or Facebook",
          Icon: Share2,
          iconBgClass: "bg-primary/10",
        },
      ],
    },
    {
      id: "danger-zone",
      title: "Danger Zone",
      containerClass: "border-destructive/30 mb-6",
      titleClass: "text-destructive",
      items: [
        {
          id: "archive",
          title: "Archive Job Listing",
          description: canArchive
            ? "Move to archive without deleting data"
            : "Job must be in Draft, Failed, or Successful status to be archived",
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
          title: "Delete Job Permanently",
          description: canDelete
            ? "Irreversibly remove listing & applicant records"
            : "Job must be in Draft status to be deleted",
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
    </ScrollView>
  );
};
