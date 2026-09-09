import React from "react";
import { View, Text } from "react-native";
import { Globe2 } from "lucide-react-native";
import { TrafficSourceItem } from "~/types";
import { cn } from "@/lib/utils";
import { useColorPalette } from "@/hooks/useColorPalette";

interface JobStatisticsAcquisitionChannelsProps {
  className?: string;
  trafficSources: TrafficSourceItem[];
}

export const JobStatisticsAcquisitionChannels = ({
  className,
  trafficSources,
}: JobStatisticsAcquisitionChannelsProps) => {
  const { palette } = useColorPalette();
  return (
    <View className={cn(className)}>
      <View className="flex-row items-center gap-2 mb-3">
        <Globe2 size={18} color={palette.foreground} />
        <Text className="text-foreground font-bold text-base">
          Top Acquisition Channels
        </Text>
      </View>

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
