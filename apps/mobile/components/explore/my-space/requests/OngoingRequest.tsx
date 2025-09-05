import { useState } from "react";
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
import { identifyUser } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { JobRequestStatus, ResponseJobRequestDto } from "~/types";
import { NavigationProps } from "~/types/app.routes";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

interface OngoingRequestEntryProps {
  className?: string;
  request: ResponseJobRequestDto;
}

export const OngoingRequestEntry = ({
  className,
  request,
}: OngoingRequestEntryProps) => {
  const navigation = useNavigation<NavigationProps>();
  const [open, setOpen] = useState(false);

  const { data: profilePicture } = useQuery({
    queryKey: ["profile-picture", request.job?.postedBy?.profile?.pictureId],
    queryFn: () =>
      api.upload.getUploadById(request.job?.postedBy?.profile?.pictureId!),
    enabled: !!request.job?.postedBy?.profile?.pictureId,
    staleTime: Infinity,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <StablePressable
        className={cn(
          "flex flex-row items-center justify-between p-4 m border border-border rounded-lg",
          className
        )}
        onPress={() => setOpen(true)}
      >
        <View>
          <Text variant={"lead"} className="my-2">
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
        </View>

        <View className="h-16 w-16">
          <Image
            source={profilePicture}
            style={{ height: "100%", width: "100%" }}
            contentFit="contain"
          />
        </View>
      </StablePressable>

      <DialogContent className="w-[90vw]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <View className="flex flex-row items-center justify-between gap-4">
          <Button
            className="w-[49%]"
            onPress={() => {
              navigation.navigate("explore/job-details", {
                id: request.job?.id,
                uploads:
                  request.job?.uploads?.map((upload) => upload.uploadId) ?? [],
              });
              setOpen(false);
            }}
          >
            <Text>Cancel Request</Text>
          </Button>

          <Button
            className="w-[49%]"
            onPress={() => setOpen(false)}
            variant="outline"
          >
            <Text>Cancel</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
};
