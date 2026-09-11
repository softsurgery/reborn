import { View, Text } from "react-native";
import { FunnelStageItem } from "~/types";
import { cn } from "@/lib/utils";

interface JobStatisticsConversionFunnelProps {
  className?: string;
  funnelStages: FunnelStageItem[];
}

export const JobStatisticsConversionFunnel = ({
  className,
  funnelStages,
}: JobStatisticsConversionFunnelProps) => {
  return (
    <View className={cn(className)}>
      {funnelStages.map((stage, idx) => (
        <View key={idx} className="mb-3.5">
          <View className="flex-row justify-between mb-1.5">
            <Text className="text-foreground font-medium text-xs">
              {stage.label}
            </Text>
            <Text className="text-muted-foreground text-xs font-semibold">
              {stage.value} ({stage.percent}%)
            </Text>
          </View>
          <View className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <View
              style={{ width: `${Math.min(stage.percent, 100)}%` }}
              className={`h-full ${stage.color} rounded-full`}
            />
          </View>
        </View>
      ))}
    </View>
  );
};
