import React from "react";
import { View } from "react-native";
import { ChevronUp } from "lucide-react-native";
import { StablePressable } from "@/components/shared/stables/StablePressable";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { useColorPalette } from "@/hooks/useColorPalette";
import { JobPricingType, ResponseJobDto } from "~/types";
import { SeeMoreText } from "@/components/shared/SeeMoreText";

interface JobDetailsBodyProps {
  className?: string;
  job: ResponseJobDto | null;
}

const COLLAPSED_TAG_COUNT = 8;

const Fact = ({
  label,
  value,
  isLast,
}: {
  label: string;
  value?: string | null;
  isLast?: boolean;
}) => (
  <View
    className={cn(
      "flex-row items-center justify-between py-3",
      !isLast && "border-b border-border",
    )}
  >
    <Text className="text-sm text-muted-foreground">{label}</Text>
    <Text
      numberOfLines={1}
      style={{ maxWidth: "60%" }}
      className="text-sm font-semibold text-card-foreground"
    >
      {value || "—"}
    </Text>
  </View>
);

const Chip = ({ label }: { label: string }) => (
  <View className="rounded-full border border-border bg-muted px-3 py-1.5">
    <Text
      style={{ fontSize: 11 }}
      className="font-medium text-muted-foreground"
    >
      {label}
    </Text>
  </View>
);

export const JobDetailsBody = ({ className, job }: JobDetailsBodyProps) => {
  const { palette } = useColorPalette();
  const [showAllTags, setShowAllTags] = React.useState(false);

  const pricingTypeLabel =
    job?.pricingType === JobPricingType.HOURLY
      ? "Hourly"
      : job?.pricingType === JobPricingType.FIXED
        ? "Fixed"
        : null;

  const tags = job?.tags ?? [];
  const visibleTags = showAllTags ? tags : tags.slice(0, COLLAPSED_TAG_COUNT);
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <View className={cn("gap-3", className)}>
      <View className="bg-card px-5 py-5">
        <Text variant="h4" className="mb-2">
          About this job
        </Text>
        <SeeMoreText
          children={job?.description ?? "No description provided."}
          numberOfLines={5}
          textClassname="text-sm leading-6 text-card-foreground"
        />
      </View>

      <View className="bg-card px-5 py-5">
        <Text variant="h4" className="mb-1">
          At a glance
        </Text>

        <Fact label="Category" value={job?.category?.label} />
        <Fact label="Work style" value={job?.style} />
        <Fact label="Experience level" value={job?.difficulty} />
        <Fact label="Payment type" value={pricingTypeLabel} isLast />
      </View>

      {tags.length > 0 && (
        <View className="bg-card px-5 py-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text variant="h4">Skills</Text>
            <Text style={{ fontSize: 11 }} className="text-muted-foreground">
              {tags.length}
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <Chip key={tag.id} label={tag.label} />
            ))}

            {/* The overflow reads as one more chip, so the rail stays intact. */}
            {hiddenCount > 0 && (
              <StablePressable
                className="rounded-full border border-primary px-3 py-1.5 active:opacity-70"
                onPress={() => setShowAllTags(true)}
              >
                <Text
                  style={{ fontSize: 11 }}
                  className="font-semibold text-primary"
                >
                  +{hiddenCount} more
                </Text>
              </StablePressable>
            )}
          </View>

          {showAllTags && tags.length > COLLAPSED_TAG_COUNT && (
            <StablePressable
              className="mt-3 flex-row items-center gap-1 self-start active:opacity-70"
              onPress={() => setShowAllTags(false)}
            >
              <ChevronUp size={14} color={palette.primary} />
              <Text
                style={{ fontSize: 12 }}
                className="font-semibold text-primary"
              >
                Show less
              </Text>
            </StablePressable>
          )}
        </View>
      )}
    </View>
  );
};
