import React from "react";
import { LegendList } from "@legendapp/list";
import {
  RefreshControl,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Search,
  Plus,
  Briefcase,
  X,
  Sparkles,
  ChevronLeft,
} from "lucide-react-native";
import { router } from "expo-router";
import { ResponseJobDto, JobStatus } from "~/types";
import { cn } from "~/lib/utils";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { useInfiniteJobs } from "@/hooks/content/job/useInfiniteJobs";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";
import { NAV_THEME } from "@/lib/theme";
import { Loader } from "@/components/shared/lotties/Loader";
import { JobManagementCard } from "@/components/jobs/job-management/JobManagmentCard";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

interface UserJobsListProps {
  className?: string;
  searching?: boolean;
}

interface FilterOption {
  label: string;
  value: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Published", value: JobStatus.POSTED },
  { label: "Drafts", value: JobStatus.DRAFT },
  { label: "In Progress", value: "in_progress" },
  { label: "Finished", value: JobStatus.FINISHED },
];

export const UserJobsList = ({
  className,
  searching = false,
}: UserJobsListProps) => {
  const { currentUser } = useCurrentUser();
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");

  const filterExpression = React.useMemo(() => {
    if (!currentUser?.id) return "";
    const base = `postedById||$eq||${currentUser.id}`;
    if (selectedFilter === "all") return base;
    if (selectedFilter === "in_progress") {
      return `${base};status||$in||Candidate Pending,Not Started,Pending,Reviewed By Worker,Reviewed By Worker & Client`;
    }
    return `${base};status||$eq||${selectedFilter}`;
  }, [currentUser?.id, selectedFilter]);

  const {
    jobs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isJobsPending,
    isRefetching,
    refetch,
  } = useInfiniteJobs({
    search,
    join: ["uploads"],
    sortKey: "createdAt",
    sortOrder: "desc",
    filter: filterExpression,
    enabled: !!currentUser,
  });

  const isPending = isJobsPending || searching;

  const renderItem = React.useCallback(({ item }: { item: ResponseJobDto }) => {
    return <JobManagementCard job={item} className="mb-3" />;
  }, []);

  const navigateToCreateJob = () => {
    router.push("/main/my-space/new-job");
  };

  const renderHeader = () => (
    <View className="flex flex-col gap-4 pb-4 pt-2">
      {/* Quick Action Banner */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={navigateToCreateJob}
        className="flex flex-row items-center justify-between bg-card border border-border/80 rounded-2xl p-4 shadow-xs"
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
            <Icon as={Sparkles} size={20} className="text-primary" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              Post a New Job
            </Text>
            <Text className="text-xs text-muted-foreground">
              Create a listing to hire talented workers
            </Text>
          </View>
        </View>
        <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
          <Icon as={Plus} size={18} className="text-primary-foreground" />
        </View>
      </TouchableOpacity>

      {/* Search Input */}
      <View className="relative">
        <Icon
          as={Search}
          size={18}
          className="absolute left-3.5 top-3.5 z-10 text-muted-foreground"
        />
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search jobs by title or keyword..."
          className="pl-10 pr-10 h-11 rounded-2xl bg-card border-border text-foreground"
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch("")}
            className="absolute right-3 top-3 z-10 p-1"
          >
            <Icon as={X} size={16} className="text-muted-foreground" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {FILTER_OPTIONS.map((filter) => {
          const isActive = selectedFilter === filter.value;
          return (
            <TouchableOpacity
              key={filter.value}
              activeOpacity={0.7}
              onPress={() => setSelectedFilter(filter.value)}
              className={cn(
                "px-4 py-2 rounded-full border flex-row items-center gap-1.5",
                isActive
                  ? "bg-primary border-primary shadow-xs"
                  : "bg-card border-border",
              )}
            >
              <Text
                className={cn(
                  "text-xs font-semibold",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        title="My Jobs"
        classNames={{ wrapper: "border-b border-border/60 pb-2.5 bg-card" }}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            icon: ChevronLeft,
            onPress: () => router.back(),
          },
        ]}
      />
      <View className="flex-1 bg-background px-2">
        <LegendList
          className="flex-1"
          style={{ flex: 1 }}
          data={isPending ? [] : jobs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          recycleItems={true}
          maintainVisibleContentPosition
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={NAV_THEME.light.colors.primary}
              colors={[NAV_THEME.light.colors.primary]}
            />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <View className="py-6 items-center">
              {isFetchingNextPage ? <Loader /> : null}
            </View>
          }
          ListEmptyComponent={
            !isPending ? (
              <View className="flex-col items-center justify-center py-12 px-6 gap-4 bg-card border border-border rounded-2xl mt-2">
                <View className="w-14 h-14 rounded-full bg-muted items-center justify-center">
                  <Icon
                    as={Briefcase}
                    size={26}
                    className="text-muted-foreground"
                  />
                </View>
                <View className="items-center gap-1">
                  <Text className="text-base font-semibold text-foreground text-center">
                    {search || selectedFilter !== "all"
                      ? "No jobs found"
                      : "No jobs posted yet"}
                  </Text>
                  <Text className="text-xs text-muted-foreground text-center max-w-[240px]">
                    {search || selectedFilter !== "all"
                      ? "Try adjusting your search keywords or clearing filter tabs."
                      : "Start hiring by posting your first job listing today."}
                  </Text>
                </View>
                {search || selectedFilter !== "all" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl px-4"
                    onPress={() => {
                      setSearch("");
                      setSelectedFilter("all");
                    }}
                  >
                    <Text className="text-xs font-semibold">Clear Filters</Text>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="default"
                    className="rounded-xl px-5 flex-row items-center gap-2"
                    onPress={navigateToCreateJob}
                  >
                    <Icon
                      as={Plus}
                      size={16}
                      className="text-primary-foreground"
                    />
                    <Text className="text-xs font-semibold text-primary-foreground">
                      Post Your First Job
                    </Text>
                  </Button>
                )}
              </View>
            ) : (
              <View className="py-16 items-center justify-center">
                <Loader />
              </View>
            )
          }
        />
      </View>
    </StableSafeAreaView>
  );
};
