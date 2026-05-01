import { format } from "date-fns";
import { router } from "expo-router";
import { ChevronRight, MapPin, Star } from "lucide-react-native";
import { JSX } from "react";
import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { identifyUser } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { ResponseJobDto, ResponseJobMetadataDto } from "~/types";

interface JobClientInformationProps {
  className?: string;
  job: ResponseJobDto | null;
  metadata?: ResponseJobMetadataDto | null;
  profilePicture: JSX.Element;
}

export const JobClientInformation = ({
  className,
  job,
  metadata,
  profilePicture,
}: JobClientInformationProps) => {
  const ratingLabel =
    metadata && Number.isFinite(metadata.rating)
      ? `${metadata.rating.toFixed(1)}${
          metadata.reviewCount ? ` (${metadata.reviewCount} reviews)` : ""
        }`
      : "—";

  const hireRateLabel =
    metadata && Number.isFinite(metadata.hireRate)
      ? `${Math.round(metadata.hireRate <= 1 ? metadata.hireRate * 100 : metadata.hireRate)}% hire rate`
      : null;

  return (
    <StablePressable
      className={cn("bg-card p-4 active:bg-muted/40", className)}
      onPress={() =>
        router.navigate({
          pathname: "/main/explore/inspect-profile",
          params: { id: job?.postedBy.id },
        })
      }
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text variant="h4">Client information</Text>
        <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1 pr-3">
          {profilePicture}
          <View className="flex-1">
            <Text
              className="text-base font-semibold text-card-foreground"
              numberOfLines={1}
            >
              {identifyUser(job?.postedBy)}
            </Text>
            <View className="flex-row flex-wrap items-center gap-4 mt-1">
              <View className="flex-row items-center gap-1">
                <Icon as={Star} size={14} color={"yellow"} fill={"yellow"} />
                <Text className="text-xs text-muted-foreground">
                  {ratingLabel}
                </Text>
              </View>
              {job?.postedBy?.region?.label ? (
                <View className="flex-row items-center gap-1">
                  <Icon as={MapPin} size={14} className="text-primary" />
                  <Text className="text-xs text-muted-foreground">
                    {job.postedBy.region.label}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-xs text-muted-foreground">Member since</Text>
          <Text className="text-xs text-card-foreground font-semibold">
            {job?.postedBy?.createdAt
              ? format(new Date(job.postedBy.createdAt), "MMMM yyyy")
              : "—"}
          </Text>
          {hireRateLabel ? (
            <Text className="text-xs text-muted-foreground">
              {hireRateLabel}
            </Text>
          ) : null}
        </View>
      </View>
    </StablePressable>
  );
};
