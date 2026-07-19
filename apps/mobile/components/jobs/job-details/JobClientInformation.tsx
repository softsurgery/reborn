import { format } from "date-fns";
import { router } from "expo-router";
import { ChevronRight, MapPin, Star } from "lucide-react-native";
import { JSX } from "react";
import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import { identifyUser } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { useColorPalette } from "@/hooks/useColorPalette";
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
  const { palette } = useColorPalette();

  const hasReviews = !!metadata?.reviewCount;
  const ratingLabel =
    metadata && Number.isFinite(metadata.rating) && hasReviews
      ? `${metadata.rating.toFixed(1)} (${metadata.reviewCount} reviews)`
      : "No reviews yet";

  const hireRatePercent =
    metadata && Number.isFinite(metadata.hireRate)
      ? Math.round(
          metadata.hireRate <= 1 ? metadata.hireRate * 100 : metadata.hireRate,
        )
      : 0;

  const hireRateLabel =
    hireRatePercent > 0 ? `${hireRatePercent}% hire rate` : null;

  return (
    <StablePressable
      className={cn("bg-card px-5 py-5 active:bg-muted/40", className)}
      onPress={() =>
        router.navigate({
          pathname: "/main/explore/inspect-profile",
          params: { id: job?.postedBy.id },
        })
      }
    >
      <View className="mb-3 flex-row items-center justify-between">
        <Text variant="h4">About the client</Text>
        <ChevronRight size={18} color={palette.mutedForeground} />
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-3 pr-3">
          {profilePicture}
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text
                numberOfLines={1}
                className="shrink text-base font-semibold text-card-foreground"
              >
                {identifyUser(job?.postedBy)}
              </Text>

              {!hasReviews && hireRatePercent === 0 ? (
                <View className="rounded-full bg-muted px-2 py-0.5">
                  <Text
                    style={{ fontSize: 10 }}
                    className="font-medium text-muted-foreground"
                  >
                    New client
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="mt-1 flex-row flex-wrap items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Star
                  size={13}
                  color={palette.primary}
                  fill={hasReviews ? palette.primary : "none"}
                />
                <Text className="text-xs text-muted-foreground">
                  {ratingLabel}
                </Text>
              </View>

              {job?.postedBy?.region?.label ? (
                <View className="flex-row items-center gap-1">
                  <MapPin size={13} color={palette.mutedForeground} />
                  <Text className="text-xs text-muted-foreground">
                    {job.postedBy.region.label}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View className="items-end">
          <Text style={{ fontSize: 10 }} className="text-muted-foreground">
            MEMBER SINCE
          </Text>
          <Text className="text-xs font-semibold text-card-foreground">
            {job?.postedBy?.createdAt
              ? format(new Date(job.postedBy.createdAt), "MMM yyyy")
              : "—"}
          </Text>
          {hireRateLabel ? (
            <Text className="mt-1 text-xs text-muted-foreground">
              {hireRateLabel}
            </Text>
          ) : null}
        </View>
      </View>
    </StablePressable>
  );
};
