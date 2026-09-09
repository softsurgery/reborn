import React from "react";
import { ScrollView, View } from "react-native";
import { useJobStatistics } from "@/hooks/content/job/useJobStatistics";
import { Loader } from "@/components/shared/lotties/Loader";
import {
  JobStatisticsKPIs,
  JobStatisticsActivityTrend,
  JobStatisticsConversionFunnel,
  JobStatisticsExperienceLevels,
  JobStatisticsAcquisitionChannels,
} from "./statistics";
import { cn } from "@/lib/utils";

interface JobStatisticsProps {
  className?: string;
  jobId?: string;
}

export const JobStatistics = ({ className, jobId }: JobStatisticsProps) => {
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

        <JobStatisticsActivityTrend dailyActivity={dailyActivity} />

        <JobStatisticsConversionFunnel funnelStages={funnelStages} />

        <JobStatisticsExperienceLevels
          experienceDistribution={experienceDistribution}
        />

        <JobStatisticsAcquisitionChannels trafficSources={trafficSources} />
      </View>
    </ScrollView>
  );
};
