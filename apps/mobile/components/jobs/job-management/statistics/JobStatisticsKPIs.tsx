import { View, Text, Pressable } from "react-native";
import {
  Users,
  Eye,
  MousePointerClick,
  CheckCircle2,
} from "lucide-react-native";
import { useColorPalette } from "@/hooks/useColorPalette";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface JobStatisticsKPIsProps {
  className?: string;
  totalViews: number;
  totalSaves: number;
  totalApplications: number;
  shortlistedCandidates: number;
  viewsTrend: number;
  savesTrend: number;
  applicationsTrend: number;
  shortlistedTrend: number;
}

export const JobStatisticsKPIs = ({
  className,
  totalViews,
  totalSaves,
  totalApplications,
  shortlistedCandidates,
  viewsTrend,
  savesTrend,
  applicationsTrend,
  shortlistedTrend,
}: JobStatisticsKPIsProps) => {
  const { palette } = useColorPalette();
  const { t } = useTranslation("jobs");

  const kpiItems = [
    {
      label: t("management.statistics.kpis.totalViews"),
      value: totalViews,
      trend: viewsTrend,
      icon: Eye,
      iconBg: "bg-blue-500/10",
    },
    {
      label: t("management.statistics.kpis.saves"),
      value: totalSaves,
      trend: savesTrend,
      icon: MousePointerClick,
      iconBg: "bg-purple-500/10",
    },
    {
      label: t("management.statistics.kpis.applications"),
      value: totalApplications,
      trend: applicationsTrend,
      icon: Users,
      iconBg: "bg-emerald-500/10",
    },
    {
      label: t("management.statistics.kpis.shortlisted"),
      value: shortlistedCandidates,
      trend: shortlistedTrend,
      icon: CheckCircle2,
      iconBg: "bg-amber-500/10",
    },
  ];

  return (
    <View className={cn("flex-row flex-wrap -mx-2", className)}>
      {kpiItems.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <Pressable key={idx} className="w-1/2 p-1 active:opacity-50">
            <View className="flex flex-row items-center justify-start gap-4 rounded-lg p-4 border border-border h-20">
              <View className="flex-col items-center justify-center gap-4">
                <View
                  className={cn(
                    "w-10 h-10 rounded-xl items-center justify-center",
                    item.iconBg,
                  )}
                >
                  <IconComponent size={24} color={palette.foreground} />
                </View>
              </View>
              <View className="flex-1">
                <View className="flex flex-row items-center gap-2">
                  <Text className="text-xl font-bold text-foreground">
                    {item.value.toLocaleString()}
                  </Text>
                  <Text
                    className={cn(
                      "text-xs font-bold",
                      item.trend > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400",
                    )}
                  >
                    ({item.trend}%)
                  </Text>
                </View>
                <Text className="text-muted-foreground text-xs mt-0.5">
                  {item.label}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
