import { ThreeDotsActionSheet } from "@/components/shared/ThreeDotsActionSheet";
import { Text } from "@/components/ui/text";
import { useServerImage } from "@/hooks/content/useServerImage";
import { cn } from "@/lib/utils";
import { ResponseJobDto } from "@/types";
import { View } from "react-native";
import { Folder, PencilLine, Send, Trash2 } from "lucide-react-native";
import { StablePressable } from "@/components/shared/StablePressable";
import { router } from "expo-router";

interface JobManagementCardProps {
  className?: string;
  job: ResponseJobDto;
}

export const JobManagementCard = ({
  className,
  job,
}: JobManagementCardProps) => {
  const { jsx: cover, isUploadPending: isCoverPending } = useServerImage({
    id: job.uploads?.[0]?.uploadId,
    fallback: "IMAGE",
    className: "border border-border bg-muted rounded-xl",
    size: { width: 90, height: 90 },
    rounded: false,
  });

  const primaryActionLabel =
    job.status === "Posted" ? "Unpublish job" : "Publish job";

  if (isCoverPending) return null;
  return (
    <View
      className={cn(
        "flex flex-row items-center justify-between gap-4 rounded-xl px-2 py-2",
        className,
      )}
    >
      <View className="flex-1 flex-row items-center gap-3">
        {cover}
        <View className="flex-1 gap-3">
          <View className="gap-1">
            <View className="flex-row items-start justify-between gap-2">
              <View className="flex-1 gap-1">
                <Text className="text-base font-semibold text-foreground">
                  {job.title}
                </Text>
                <Text className="text-sm text-muted-foreground line-clamp-2">
                  {job.description || "No description available"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="">
        <ThreeDotsActionSheet
          size={30}
          options={[
            {
              label: "Manage job",
              icon: Folder,
              onPress: () => {
                router.push({
                  pathname: "/main/my-space/manage-job",
                  params: { id: job.id },
                });
              },
            },
            {
              label: "Edit job",
              icon: PencilLine,
              onPress: () => {},
            },
            {
              label: primaryActionLabel,
              icon: Send,
              onPress: () => {},
            },
            {
              label: "Delete job",
              icon: Trash2,
              variant: "destructive",
              onPress: () => {},
            },
          ]}
        />
      </View>
    </View>
  );
};
