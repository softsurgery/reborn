import React from "react";
import { format } from "date-fns";
import { useNavigation } from "expo-router";
import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { JobRequestStatus, ResponseJobRequestDto } from "~/types";
import { NavigationProps } from "~/types/app.routes";
import { useServerImage } from "~/hooks/content/useServerImage";
import Icon from "~/lib/Icon";
import { Eye } from "lucide-react-native";

interface OngoingRequestEntryProps {
  className?: string;
  request: ResponseJobRequestDto;
}

export const OngoingRequestEntry = ({
  className,
  request,
}: OngoingRequestEntryProps) => {
  const navigation = useNavigation<NavigationProps>();
  const { jsx: profilePicture } = useServerImage({
    id: request.job?.postedBy?.profile?.pictureId!,
    fallback: identifyUserAvatar(request.job?.postedBy),
    size: { width: 100, height: 100 },
  });

  return (
    <StablePressable
      className={cn(
        "flex flex-row items-center justify-between p-4 m border border-border rounded-lg",
        className
      )}
    >
      <View>
        <Text variant={"lead"} className="my-1">
          {request.job?.title}
        </Text>
        {/* Client */}
        <View className="flex flex-row items-center gap-1">
          <Text>Client:</Text>
          <Text className="font-thin">
            {identifyUser(request.job?.postedBy)}
          </Text>
        </View>
        {/* Requested At */}
        <View className="flex flex-row items-center gap-1">
          <Text>Requested at:</Text>
          <Text className="text-muted-foreground font-thin">
            {request.createdAt
              ? format(request.createdAt, "hh:mm dd MMMM yyyy")
              : ""}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-1">
          <Text>Status:</Text>
          <Text
            className={cn(
              "text-sm font-medium",
              request.status === JobRequestStatus.Approved
                ? "text-green-500"
                : request.status === JobRequestStatus.Rejected
                ? "text-red-500"
                : request.status === JobRequestStatus.Pending
                ? "text-secondary-foreground"
                : ""
            )}
          >
            {request.status === JobRequestStatus.Pending
              ? "Pending"
              : request.status === JobRequestStatus.Approved
              ? "Approved"
              : "Rejected"}
          </Text>
        </View>
        {/* Actions */}
        <View className="flex flex-row items-center gap-1 mt-4">
          <Button size={"sm"} variant={"secondary"}>
            <Text>Cancel Application</Text>
          </Button>
        </View>
      </View>
      <StablePressable
        onPressClassname="opacity-50"
        onPress={() => {
          navigation.navigate("explore/user-profile", {
            id: request.job?.postedBy?.id,
          });
        }}
      >
        {profilePicture}
      </StablePressable>
    </StablePressable>
  );
};
