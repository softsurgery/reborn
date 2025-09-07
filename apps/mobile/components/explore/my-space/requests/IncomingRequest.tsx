import { format } from "date-fns";
import { useNavigation } from "expo-router";
import { Check, Search, X } from "lucide-react-native";
import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useServerImage } from "~/hooks/content/useServerImage";
import Icon from "~/lib/Icon";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { ResponseJobRequestDto } from "~/types";
import { NavigationProps } from "~/types/app.routes";

interface IncomingRequestEntryProps {
  className?: string;
  request: ResponseJobRequestDto;
}

export const IncomingRequestEntry = ({
  className,
  request,
}: IncomingRequestEntryProps) => {
  const navigation = useNavigation<NavigationProps>();

  const { jsx: profilePictureBlock } = useServerImage({
    id: request.user?.profile.pictureId!,
    fallback: identifyUserAvatar(request.user),
    size: { width: 100, height: 100 },
  });

  return (
    <View
      className={cn(
        "flex flex-row items-center justify-between p-4 m border border-border rounded-lg",
        className
      )}
    >
      <View className="flex flex-1">
        <Text variant={"lead"} className="my-1">
          {request.job?.title}
        </Text>
        {/* Requested by */}
        <View className="flex flex-row items-center gap-1">
          <Text>Requested by:</Text>
          <Text className="font-thin">{identifyUser(request.user)}</Text>
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
        {/* Actions */}
        <View
          className={cn("flex flex-row items-center gap-1 mt-4", className)}
        >
          <Button
            size={"sm"}
            variant={"secondary"}
            className="flex-row items-center gap-2"
            onPress={() => {
              navigation.navigate("explore/job-details", {
                id: request.job?.id,
                uploads:
                  request.job?.uploads?.map((upload) => upload.uploadId) ?? [],
              });
            }}
          >
            <Icon
              name={Check}
              size={14}
              className="text-secondary-foreground"
            />
            <Text>Approve</Text>
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className="flex-row items-center gap-2"
          >
            <Icon name={X} size={14} className="text-secondary-foreground" />
            <Text>Reject</Text>
          </Button>
        </View>
      </View>
      {/* Client Profile */}
      <StablePressable
        className="w-1/4"
        onPressClassname="opacity-50"
        onPress={() => {
          navigation.navigate("explore/user-profile", {
            id: request.userId,
          });
        }}
      >
        {profilePictureBlock}
      </StablePressable>
    </View>
  );
};
