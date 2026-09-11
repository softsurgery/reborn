import { ScrollView, View } from "react-native";
import { useJobStatistics } from "@/hooks/content/job/useJobStatistics";
import { Loader } from "@/components/shared/lotties/Loader";
import { Text } from "@/components/ui/text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  JobStatisticsKPIs,
  JobStatisticsActivityTrend,
  JobStatisticsConversionFunnel,
  JobStatisticsExperienceLevels,
  JobStatisticsAcquisitionChannels,
} from "./statistics";
import { cn } from "@/lib/utils";
import { BarChart2, Briefcase, Globe2, Target } from "lucide-react-native";
import { useColorPalette } from "@/hooks/useColorPalette";

interface JobStatisticsProps {
  className?: string;
  jobId?: string;
}

export const JobStatistics = ({ className, jobId }: JobStatisticsProps) => {
  const { palette } = useColorPalette();
  const { statistics, isStatisticsPending } = useJobStatistics({ id: jobId });

  if (isStatisticsPending) {
    return <Loader className="flex-1 justify-center items-center py-10" />;
  }

  const defaultDailyActivity = [
    { day: "Mon", date: "", views: 0, apps: 0, height: "h-8" },
    { day: "Tue", date: "", views: 0, apps: 0, height: "h-8" },
    { day: "Wed", date: "", views: 0, apps: 0, height: "h-8" },
    { day: "Thu", date: "", views: 0, apps: 0, height: "h-8" },
    { day: "Fri", date: "", views: 0, apps: 0, height: "h-8" },
    { day: "Sat", date: "", views: 0, apps: 0, height: "h-8" },
    { day: "Sun", date: "", views: 0, apps: 0, height: "h-8" },
  ];

  const dailyActivity = statistics?.dailyActivity?.length
    ? statistics.dailyActivity
    : defaultDailyActivity;

  const funnelStages = statistics?.funnelStages?.length
    ? statistics.funnelStages
    : [
        { label: "Job Views", value: "0", percent: 0, color: "bg-blue-500" },
        {
          label: "Saved / Interest",
          value: "0",
          percent: 0,
          color: "bg-purple-500",
        },
        {
          label: "Applications",
          value: "0",
          percent: 0,
          color: "bg-emerald-500",
        },
        { label: "Shortlisted", value: "0", percent: 0, color: "bg-amber-500" },
        {
          label: "Assigned Worker",
          value: "0",
          percent: 0,
          color: "bg-rose-500",
        },
      ];

  const trafficSources = statistics?.trafficSources?.length
    ? statistics.trafficSources
    : [
        {
          source: "Direct App Applications",
          percent: "0%",
          count: "0 candidates",
        },
        {
          source: "Saved Jobs Interest",
          percent: "0%",
          count: "0 users saved",
        },
      ];

  const experienceDistribution = statistics?.experienceDistribution?.length
    ? statistics.experienceDistribution
    : [
        { level: "Senior (5-8 yrs)", percent: 55, color: "bg-primary" },
        { level: "Mid-Level (3-5 yrs)", percent: 30, color: "bg-blue-500" },
        {
          level: "Lead / Entry (0-3 yrs)",
          percent: 15,
          color: "bg-purple-500",
        },
      ];

  const totalViews = statistics?.totalViews ?? 0;
  const totalSaves = statistics?.totalSaves ?? 0;
  const totalApplications = statistics?.totalApplications ?? 0;
  const shortlistedCandidates = statistics?.shortlistedCandidates ?? 0;

  const viewsTrend = statistics?.viewsTrend ?? 0;
  const savesTrend = statistics?.savesTrend ?? 0;
  const applicationsTrend = statistics?.applicationsTrend ?? 0;
  const shortlistedTrend = statistics?.shortlistedTrend ?? 0;

  const accordionItems = [
    {
      value: "item-2",
      icon: BarChart2,
      iconSize: 20,
      title: "Weekly Activity Trend",
      subtitle: "Daily views & application distribution",
      content: <JobStatisticsActivityTrend dailyActivity={dailyActivity} />,
    },
    {
      value: "item-3",
      icon: Target,
      iconSize: 20,
      title: "Application Funnel",
      subtitle: "Conversion rates across recruitment stages",
      content: <JobStatisticsConversionFunnel funnelStages={funnelStages} />,
    },
    {
      value: "item-4",
      icon: Briefcase,
      iconSize: 18,
      title: "Applicant Experience Levels",
      subtitle: "Breakdown of candidate seniority levels",
      content: (
        <JobStatisticsExperienceLevels
          experienceDistribution={experienceDistribution}
        />
      ),
    },
    {
      value: "item-5",
      icon: Globe2,
      iconSize: 18,
      title: "Top Acquisition Channels",
      subtitle: "Sources driving candidate traffic to your job",
      content: (
        <JobStatisticsAcquisitionChannels trafficSources={trafficSources} />
      ),
    },
  ];

  return (
    <ScrollView
      className={cn("flex-1 bg-background px-4 pt-4", className)}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex flex-col gap-6 pb-8">
        <JobStatisticsKPIs
          totalViews={totalViews}
          totalSaves={totalSaves}
          totalApplications={totalApplications}
          shortlistedCandidates={shortlistedCandidates}
          viewsTrend={viewsTrend}
          savesTrend={savesTrend}
          applicationsTrend={applicationsTrend}
          shortlistedTrend={shortlistedTrend}
        />

        <Accordion type="multiple" collapsible className="w-full">
          {accordionItems.map((item) => {
            const Icon = item.icon;
            return (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="py-4">
                  <View className="flex-row items-center gap-3 pr-4">
                    <Icon size={item.iconSize} color={palette.foreground} />
                    <View>
                      <Text className="text-foreground font-bold text-base">
                        {item.title}
                      </Text>
                      {item.subtitle && (
                        <Text className="text-muted-foreground text-xs mt-0.5">
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>
                </AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </View>
    </ScrollView>
  );
};
