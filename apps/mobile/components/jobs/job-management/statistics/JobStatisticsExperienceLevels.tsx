import { View, Text } from "react-native";
import { Briefcase } from "lucide-react-native";
import { ExperienceDistributionItem } from "~/types";
import { cn } from "@/lib/utils";
import { useColorPalette } from "@/hooks/useColorPalette";

interface JobStatisticsExperienceLevelsProps {
  className?: string;
  experienceDistribution: ExperienceDistributionItem[];
}

export const JobStatisticsExperienceLevels = ({
  className,
  experienceDistribution,
}: JobStatisticsExperienceLevelsProps) => {
  const { palette } = useColorPalette();
  return (
    <View className={cn(className)}>
      <View className="flex-row items-center gap-2 mb-3">
        <Briefcase size={18} color={palette.foreground} />
        <Text className="text-foreground font-bold text-base">
          Applicant Experience Levels
        </Text>
      </View>

      {experienceDistribution.map((item, idx) => (
        <View key={idx} className="mb-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-muted-foreground text-xs font-medium">
              {item.level}
            </Text>
            <Text className="text-foreground font-bold text-xs">
              {item.percent}%
            </Text>
          </View>
          <View className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <View
              style={{ width: `${Math.min(item.percent, 100)}%` }}
              className={`h-full ${item.color} rounded-full`}
            />
          </View>
        </View>
      ))}
    </View>
  );
};
