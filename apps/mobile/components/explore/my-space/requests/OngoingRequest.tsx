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
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { identifyUser } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { JobRequestStatus, ResponseJobRequestDto } from "~/types";
import { NavigationProps } from "~/types/app.routes";

interface OngoingRequestEntryProps {
  className?: string;
  request: ResponseJobRequestDto;
}

export const OngoingRequestEntry = ({
  className,
  request,
}: OngoingRequestEntryProps) => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <StablePressable
          className={cn("p-4 m border border-border rounded-lg", className)}
        >
          <Text>{request.job?.title}</Text>
          <Text>{identifyUser(request.job?.postedBy)}</Text>
          <Text className="text-muted-foreground font-thin">
            {request.createdAt
              ? format(request.createdAt, "hh:mm dd MMMM yyyy")
              : ""}
          </Text>
          <View>
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
        </StablePressable>
      </DialogTrigger>
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
            className="w-1/2"
            onPress={() => {
              navigation.navigate("explore/job-details", {
                id: request.job?.id,
                uploads:
                  request.job?.uploads?.map((upload) => upload.uploadId) ?? [],
              });
            }}
          >
            <Text>Approve Request</Text>
          </Button>
          <Button className="w-1/2" onPress={() => {}} variant={"outline"}>
            <Text>Cancel Request</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
};
