import React from "react";
import { Clock4, Layers, TrendingUp, Wallet } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { ResponseJobDto } from "~/types";
import { SeeMoreText } from "@/components/shared/SeeMoreText";
import { Badge } from "@/components/ui/badge";

interface JobDetailsBodyProps {
  className?: string;
  job: ResponseJobDto | null;
}

export const JobDetailsBody = ({ className, job }: JobDetailsBodyProps) => {
  const pricingTypeLabel = React.useMemo(() => {
    switch (job?.pricingType) {
      case "hourly":
        return "Hourly";
      case "fixed":
        return "Fixed";
      case undefined:
      case null:
        return "—";
      default:
        return String(job?.pricingType);
    }
  }, [job?.pricingType]);

  return (
    <View className={cn("mt-4", className)}>
      {/* About */}
      <View className="bg-card px-4 pt-4 pb-8">
        <Text variant="h4" className="mb-2">
          About
        </Text>
        <Text className="text-base font-semibold text-foreground">
          <SeeMoreText
            children={job?.description ?? "No description"}
            numberOfLines={4}
          />
        </Text>
      </View>

      {/* Details */}
      <View className="bg-card px-4 pb-4">
        <View className="flex-row flex-wrap">
          {/* Item */}
          <View className="w-1/2 flex-row items-center gap-2 mb-3">
            <Icon as={Layers} size={18} />
            <Text className="text-sm font-medium text-card-foreground">
              {job?.category?.label ?? "—"}
            </Text>
          </View>

          {/* Item */}
          <View className="w-1/2 flex-row items-center gap-2 mb-3">
            <Icon as={TrendingUp} size={18} />
            <Text className="text-sm font-medium text-card-foreground">
              {job?.difficulty ?? "—"}
            </Text>
          </View>

          {/* Item */}
          <View className="w-1/2 flex-row items-center gap-2 mb-3">
            <Icon as={Clock4} size={18} />
            <Text className="text-sm font-medium text-card-foreground">
              {job?.style ?? "—"}
            </Text>
          </View>

          {/* Item */}
          <View className="w-1/2 flex-row items-center gap-2 mb-3">
            <Icon as={Wallet} size={18} />
            <Text className="text-sm font-medium text-card-foreground">
              {pricingTypeLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Tags */}
      <View className="bg-card px-4 pb-4">
        <View className="flex-row flex-wrap gap-2 mt-2">
          {job?.tags?.length ? (
            job.tags.map((tag) => (
              <Badge key={tag.id}>
                <Text className="text-xs text-muted-foreground">
                  {tag.label}
                </Text>
              </Badge>
            ))
          ) : (
            <Text className="text-xs text-muted-foreground">No tags</Text>
          )}
        </View>
      </View>
    </View>
  );
};
