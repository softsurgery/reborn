import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View } from "react-native";
import { HomePageHeader } from "./HomePageHeader";
import { JobCard } from "./JobCard";
import { useState, useMemo } from "react";
import { Text } from "../ui/text";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const allJobs = useQuery({
    queryKey: ["jobs"],
    queryFn: () => api.job.findAll(),
  });

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) {
      return allJobs.data || [];
    }

    const query = searchQuery.toLowerCase();
    return (allJobs.data || []).filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
    );
  }, [searchQuery, allJobs.data]);

  const isLoading = allJobs.isLoading;
  const hasJobs = (allJobs.data || []).length > 0;

  return (
    <KeyboardAwareScrollView>
      <HomePageHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultsCount={filteredJobs.length}
      />

      <View className="pb-4">
        {isLoading ? (
          <View className="px-4 py-8 items-center">
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              Loading jobs...
            </Text>
          </View>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : searchQuery.trim() ? (
          <View className="px-4 py-8 items-center">
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              No jobs found matching "{searchQuery}"
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">
              Try different keywords or check your spelling
            </Text>
          </View>
        ) : !hasJobs ? (
          <View className="px-4 py-8 items-center">
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              No jobs available right now
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">
              Please check back later
            </Text>
          </View>
        ) : null}
      </View>
    </KeyboardAwareScrollView>
  );
};
