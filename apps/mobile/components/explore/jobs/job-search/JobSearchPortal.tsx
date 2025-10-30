import React from "react";
import { View } from "react-native";
import { IconTextInput } from "~/components/shared/IconTextInput";
import { Search } from "lucide-react-native";
import { router, useNavigation } from "expo-router";
import { Text } from "~/components/ui/text";
import { JobSearchResults } from "./JobSearchResults";
import { useDebounce } from "~/hooks/useDebounce";
import { LegendList } from "@legendapp/list";
import { cn } from "~/lib/utils";
import { useJobStore } from "~/hooks/stores/useJobStore";
import { ResponseJobDto } from "~/types";
import { JobSearchResultEntry } from "./JobSearchResultEntry";

interface JobSearchPortalProps {
  className?: string;
}

export const JobSearchPortal = ({ className }: JobSearchPortalProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const jobStore = useJobStore();
  const { value: debouncedSearchQuery, loading: searching } = useDebounce(
    searchQuery,
    2000
  );
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="flex flex-row gap-4 w-full pr-4">
          <IconTextInput
            icon={Search}
            placeholder="Search Reborn"
            className="flex-1"
            iClassame="text-muted-foreground"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      ),
    });
  }, [navigation, searchQuery]);

  const renderItem = React.useCallback(
    ({ item }: { item: ResponseJobDto }) => (
      <JobSearchResultEntry
        item={item}
        onPress={() => {
          router.push({
            pathname: "/main/explore/job-details",
            params: { id: item.id },
          });
        }}
      />
    ),
    []
  );

  return (
    <View className={cn("flex flex-1 flex-col mx-2", className)}>
      {searchQuery ? (
        <JobSearchResults search={searchQuery} searching={searching} />
      ) : (
        <View className="flex-1">
          <View className="px-2 pt-2">
            <Text variant={"muted"}>Recent</Text>
          </View>

          <LegendList
            data={jobStore.searchHistory}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            recycleItems={true}
            maintainVisibleContentPosition
            ListEmptyComponent={
              <View className="p-6 items-center">
                <Text className="text-muted-foreground">No jobs available</Text>
              </View>
            }
          />

          <View className="px-2 pt-2">
            <Text variant={"muted"}>Suggested</Text>
          </View>
        </View>
      )}
    </View>
  );
};
