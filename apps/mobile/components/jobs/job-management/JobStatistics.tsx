import { View, Text, ScrollView } from "react-native";
import {
  Users,
  Eye,
  MousePointerClick,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  BarChart2,
  PieChart,
  Globe2,
  Clock,
  Briefcase,
  Target,
  Zap,
} from "lucide-react-native";

export const JobStatistics = () => {
  const dailyActivity = [
    { day: "Mon", views: 180, apps: 8, height: "h-16" },
    { day: "Tue", views: 240, apps: 14, height: "h-24" },
    { day: "Wed", views: 310, apps: 18, height: "h-32" },
    { day: "Thu", views: 280, apps: 12, height: "h-28" },
    { day: "Fri", views: 150, apps: 4, height: "h-14" },
    { day: "Sat", views: 60, apps: 1, height: "h-8" },
    { day: "Sun", views: 90, apps: 3, height: "h-10" },
  ];

  const funnelStages = [
    { label: "Job Views", value: "1,240", percent: 100, color: "bg-blue-500" },
    { label: "Link Clicks", value: "342", percent: 27.5, color: "bg-purple-500" },
    { label: "Applications", value: "58", percent: 16.9, color: "bg-emerald-500" },
    { label: "Shortlisted", value: "12", percent: 20.6, color: "bg-amber-500" },
    { label: "Interviews", value: "5", percent: 41.6, color: "bg-rose-500" },
  ];

  const trafficSources = [
    { source: "LinkedIn Jobs", percent: "45%", count: "26 candidates" },
    { source: "Direct App Search", percent: "30%", count: "17 candidates" },
    { source: "Indeed Integration", percent: "15%", count: "9 candidates" },
    { source: "Employee Referrals", percent: "10%", count: "6 candidates" },
  ];

  const experienceDistribution = [
    { level: "Senior (5-8 yrs)", percent: 55, color: "bg-primary" },
    { level: "Mid-Level (3-5 yrs)", percent: 30, color: "bg-blue-500" },
    { level: "Lead / Staff (8+ yrs)", percent: 15, color: "bg-purple-500" },
  ];

  return (
    <ScrollView className="flex-1 bg-background p-4" showsVerticalScrollIndicator={false}>
      {/* Top Level KPIs */}
      <View className="flex-row flex-wrap -mx-1.5 mb-4">
        <View className="w-1/2 px-1.5 mb-3">
          <View className="bg-card rounded-2xl p-4 border border-border shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-9 h-9 rounded-xl bg-blue-500/10 items-center justify-center">
                <Eye size={18} className="text-blue-500" />
              </View>
              <View className="flex-row items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <ArrowUpRight size={12} className="text-emerald-600 dark:text-emerald-400" />
                <Text className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">+18%</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-foreground">1,240</Text>
            <Text className="text-muted-foreground text-xs mt-0.5">Total Job Views</Text>
          </View>
        </View>

        <View className="w-1/2 px-1.5 mb-3">
          <View className="bg-card rounded-2xl p-4 border border-border shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-9 h-9 rounded-xl bg-purple-500/10 items-center justify-center">
                <MousePointerClick size={18} className="text-purple-500" />
              </View>
              <View className="flex-row items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <ArrowUpRight size={12} className="text-emerald-600 dark:text-emerald-400" />
                <Text className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">+12%</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-foreground">342</Text>
            <Text className="text-muted-foreground text-xs mt-0.5">Total Clicks</Text>
          </View>
        </View>

        <View className="w-1/2 px-1.5 mb-3">
          <View className="bg-card rounded-2xl p-4 border border-border shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-9 h-9 rounded-xl bg-emerald-500/10 items-center justify-center">
                <Users size={18} className="text-emerald-500" />
              </View>
              <View className="flex-row items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <ArrowUpRight size={12} className="text-emerald-600 dark:text-emerald-400" />
                <Text className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">+24%</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-foreground">58</Text>
            <Text className="text-muted-foreground text-xs mt-0.5">Total Applications</Text>
          </View>
        </View>

        <View className="w-1/2 px-1.5 mb-3">
          <View className="bg-card rounded-2xl p-4 border border-border shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-9 h-9 rounded-xl bg-amber-500/10 items-center justify-center">
                <CheckCircle2 size={18} className="text-amber-500" />
              </View>
              <View className="flex-row items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <ArrowUpRight size={12} className="text-emerald-600 dark:text-emerald-400" />
                <Text className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">+5%</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-foreground">12</Text>
            <Text className="text-muted-foreground text-xs mt-0.5">Shortlisted Candidates</Text>
          </View>
        </View>
      </View>

      {/* AI Recommendation Insights Card */}
      <View className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-4 flex-row items-start gap-3">
        <Sparkles size={20} className="text-amber-500 mt-0.5" />
        <View className="flex-1">
          <Text className="text-amber-600 dark:text-amber-400 font-bold text-sm">AI Analytics Insight</Text>
          <Text className="text-foreground text-xs mt-1 leading-5">
            Your posting is receiving 25% higher application rates on Wednesdays. Consider promoting the post mid-week for maximum engagement.
          </Text>
        </View>
      </View>

      {/* Weekly Engagement Activity Bar Chart */}
      <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-foreground font-bold text-base">Weekly Activity Trend</Text>
            <Text className="text-muted-foreground text-xs">Daily views & application distribution</Text>
          </View>
          <BarChart2 size={20} className="text-muted-foreground" />
        </View>

        <View className="flex-row items-end justify-between h-36 pt-4 pb-2 border-b border-border/50 px-2">
          {dailyActivity.map((item, idx) => (
            <View key={idx} className="items-center flex-1">
              <View className={`w-6 ${item.height} bg-primary rounded-t-md opacity-90`} />
              <Text className="text-muted-foreground text-[10px] font-medium mt-2">{item.day}</Text>
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

      {/* Conversion Funnel */}
      <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-foreground font-bold text-base">Application Funnel</Text>
            <Text className="text-muted-foreground text-xs">Conversion rates across recruitment stages</Text>
          </View>
          <Target size={20} className="text-muted-foreground" />
        </View>

        {funnelStages.map((stage, idx) => (
          <View key={idx} className="mb-3.5">
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-foreground font-medium text-xs">{stage.label}</Text>
              <Text className="text-muted-foreground text-xs font-semibold">{stage.value} ({stage.percent}%)</Text>
            </View>
            <View className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
              <View style={{ width: `${stage.percent}%` }} className={`h-full ${stage.color} rounded-full`} />
            </View>
          </View>
        ))}
      </View>

      {/* Candidate Demographics Breakdown */}
      <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">
        <View className="flex-row items-center gap-2 mb-3">
          <Briefcase size={18} className="text-primary" />
          <Text className="text-foreground font-bold text-base">Applicant Experience Levels</Text>
        </View>

        {experienceDistribution.map((item, idx) => (
          <View key={idx} className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="text-muted-foreground text-xs font-medium">{item.level}</Text>
              <Text className="text-foreground font-bold text-xs">{item.percent}%</Text>
            </View>
            <View className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <View style={{ width: `${item.percent}%` }} className={`h-full ${item.color} rounded-full`} />
            </View>
          </View>
        ))}
      </View>

      {/* Acquisition Channels */}
      <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-6">
        <View className="flex-row items-center gap-2 mb-3">
          <Globe2 size={18} className="text-primary" />
          <Text className="text-foreground font-bold text-base">Top Acquisition Channels</Text>
        </View>

        {trafficSources.map((source, idx) => (
          <View key={idx} className="flex-row items-center justify-between py-2 border-b border-border/40 last:border-b-0">
            <Text className="text-foreground font-medium text-sm">{source.source}</Text>
            <View className="items-end">
              <Text className="text-primary font-bold text-xs">{source.percent}</Text>
              <Text className="text-muted-foreground text-[10px]">{source.count}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
