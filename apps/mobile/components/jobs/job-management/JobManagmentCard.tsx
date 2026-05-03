import { ThreeDotsActionSheet } from "@/components/shared/ThreeDotsActionSheet";
import { Text } from "@/components/ui/text";
import { useServerImage } from "@/hooks/content/useServerImage";
import { cn } from "@/lib/utils";
import { ResponseJobDto } from "@/types";
import { View } from "react-native";
import {
  ExternalLink,
  FileText,
  Folder,
  PencilLine,
  Send,
  Telescope,
  Trash2,
} from "lucide-react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

interface JobManagementCardProps {
  className?: string;
  job: ResponseJobDto;
}

export const JobManagementCard = ({
  className,
  job,
}: JobManagementCardProps) => {
  const { jsx: cover } = useServerImage({
    id: job.uploads?.[0]?.uploadId,
    fallback: "IMAGE",
    wrapperClassName: "border border-border bg-muted rounded-lg",
    size: { width: 50, height: 50 },
    rounded: false,
  });

  const primaryActionLabel = job.status === "Posted" ? "Unpublish" : "Publish";

  return (
    <View className={cn("flex flex-col gap-4 px-2 py-2", className)}>
      <View className="flex flex-row items-center justify-between gap-6 rounded-xl ">
        {cover}
        <View className="flex-1 flex-row items-start gap-3">
          <View className="flex-1 gap-3">
            <View className="gap-1">
              {/* Title & Description */}
              <View className="flex-1 gap-1">
                <Text className="text-base font-semibold text-foreground">
                  {job.title}
                </Text>
                <Text className="text-sm text-muted-foreground line-clamp-3">
                  {job.description || "No description available"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ThreeDotsActionSheet
          size={30}
          options={[
            {
              label: "View Job",
              icon: Telescope,
              onPress: () => {
                router.push({
                  pathname: "/main/explore/job-details",
                  params: { id: job.id },
                });
              },
            },
            {
              label: "Manage Job",
              icon: Folder,
              onPress: () => {
                router.push({
                  pathname: "/main/my-space/manage-job",
                  params: { id: job.id },
                });
              },
            },
            {
              label: "Edit Job",
              icon: PencilLine,
              onPress: () => {
                router.push({
                  pathname: "/main/my-space/update-job",
                  params: { id: job.id },
                });
              },
            },
            {
              label: primaryActionLabel,
              icon: Send,
              onPress: () => {},
            },
            {
              label: "View Requests",
              icon: FileText,
              onPress: () => {},
            },
            {
              label: "Share Job",
              icon: ExternalLink,
              onPress: () => {},
            },
            {
              label: "Delete",
              icon: Trash2,
              variant: "destructive",
              onPress: () => {},
            },
          ]}
        />
      </View>
      {/* Actions */}
      <View className="flex-row items-center gap-2">
        <Button
          size="sm"
          variant="default"
          className="flex-1 rounded-full"
          onPress={() => {
            router.push({
              pathname: "/main/my-space/manage-job",
              params: { id: job.id },
            });
          }}
        >
          <Icon as={Folder} />
          <Text variant="large">Manage</Text>
        </Button>
        <Button size="sm" variant="outline" className="flex-1 rounded-full">
          <Icon as={ExternalLink} />
          <Text variant="large">Share</Text>
        </Button>
      </View>
    </View>
  );
};
