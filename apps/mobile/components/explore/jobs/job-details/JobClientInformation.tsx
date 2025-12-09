import { format } from "date-fns";
import { router } from "expo-router";
import { MapPin, Star } from "lucide-react-native";
import { JSX } from "react";
import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import { identifyUser } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { ResponseJobDto } from "~/types";

interface JobClientInformationProps {
  className?: string;
  job: ResponseJobDto | null;
  profilePicture: JSX.Element;
}

export const JobClientInformation = ({
  className,
  job,
  profilePicture,
}: JobClientInformationProps) => {
  return (
    <StablePressable
      className={cn(className)}
      onPress={() =>
        router.navigate({
          pathname: "/main/explore/inspect-profile",
          params: { id: job?.postedBy.id },
        })
      }
      onPressClassname="bg-transparent"
    >
      <Text className="text-lg font-semibold text-foreground mb-3">
        Client information
      </Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {profilePicture}
          <View>
            <Text className="text-base font-medium text-card-foreground">
              {identifyUser(job?.postedBy)}
            </Text>
            <View className="flex-row items-center gap-4 mt-1">
              <View className="flex-row items-center gap-1">
                <Star size={12} color="#fbbf24" fill="#fbbf24" />
                <Text className="text-xs text-muted-foreground">
                  4.9 (127 reviews)
                </Text>
              </View>
              {job?.postedBy.profile?.region && (
                <View className="flex-row items-center gap-1">
                  <MapPin size={12} color="#6366f1" />
                  <Text className="text-xs text-muted-foreground">
                    {job.postedBy.profile.region.label}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-xs text-muted-foreground">Member since</Text>
          <Text className="text-xs text-card-foreground font-medium">
            {job?.postedBy.createdAt
              ? format(job.postedBy.createdAt, "MMMM yyyy")
              : ""}
          </Text>
          <Text className="text-xs text-muted-foreground">89% hire rate</Text>
        </View>
      </View>
    </StablePressable>
  );
};
