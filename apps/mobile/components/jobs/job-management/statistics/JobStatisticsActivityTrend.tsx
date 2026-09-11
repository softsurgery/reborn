import { View, Text } from "react-native";
import { DailyActivityItem } from "~/types";
import { cn } from "@/lib/utils";

interface JobStatisticsActivityTrendProps {
  className?: string;
  dailyActivity: DailyActivityItem[];
}

export const JobStatisticsActivityTrend = ({
  className,
  dailyActivity,
}: JobStatisticsActivityTrendProps) => {
  return (
    <View className={cn(className)}>
      <View className="flex-row items-end justify-between h-36 pt-4 pb-2 border-b border-border/50 px-2">
        {dailyActivity.map((item, idx) => (
          <View key={idx} className="items-center flex-1">
            <View
              className={`w-6 ${item.height} bg-primary rounded-t-md opacity-90`}
            />
            <Text className="text-muted-foreground text-[10px] font-medium mt-2">
              {item.day}
            </Text>
          </View>
        ))}
      </View>
      <View className="flex-row items-center justify-center gap-6 mt-3">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full bg-primary" />
          <Text className="text-muted-foreground text-xs">Page Views</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full bg-muted-foreground/30" />
          <Text className="text-muted-foreground text-xs">Applications</Text>
        </View>
      </View>
    </View>
  );
};
