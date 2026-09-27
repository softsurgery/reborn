import { View, Text } from "react-native";
import { TrafficSourceItem } from "~/types";
import { cn } from "@/lib/utils";

interface JobStatisticsAcquisitionChannelsProps {
  className?: string;
  trafficSources: TrafficSourceItem[];
}

export const JobStatisticsAcquisitionChannels = ({
  className,
  trafficSources,
}: JobStatisticsAcquisitionChannelsProps) => {
  return (
    <View className={cn(className)}>
      {trafficSources.map((source, idx) => (
        <View
          key={idx}
          className="flex-row items-center justify-between py-2 border-b border-border/40 last:border-b-0"
        >
          <Text className="text-foreground font-medium text-sm">
            {source.source}
          </Text>
          <View className="items-end">
            <Text className="text-primary font-bold text-xs">
              {source.percent}
            </Text>
            <Text className="text-muted-foreground text-[10px]">
              {source.count}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};
