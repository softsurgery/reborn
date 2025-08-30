import React from "react";
import { View, SafeAreaView as ReactNativeSafeAreaView } from "react-native";
import { ExploreHeader } from "./ExploreHeader";
import { useDebounce } from "~/hooks/useDebounce";
import { ExploreCommon } from "./ExploreCommon";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { ExploreFollowing } from "./ExploreFollowing";
import { cn } from "~/lib/utils";

export const Explore = () => {
  const [tab, setTab] = React.useState<"recent" | "followings">("recent");
  const [search, setSearch] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(search, 1000);

  return (
    <View className="flex-1 px-1">
      <View className="px-4">
        <ExploreHeader />
      </View>
      <View className="flex flex-row gap-4 pt-2">
        <Button
          onPress={() => setTab("recent")}
          variant={"ghost"}
          className={cn(
            "w-1/2",
            tab === "recent" ? "border-b-2 border-b-primary" : ""
          )}
        >
          <Text>Recent</Text>
        </Button>
        <Button
          onPress={() => setTab("followings")}
          variant={"ghost"}
          className={cn(
            "w-1/2",
            tab === "followings" ? "border-b-2 border-b-primary" : ""
          )}
        >
          <Text>Followings</Text>
        </Button>
      </View>
      <View className="flex-1 mx-2">
        {/* Manual Tabs */}

        <ReactNativeSafeAreaView>
          {tab === "recent" ? (
            <ExploreCommon search={debouncedSearchTerm} searching={searching} />
          ) : (
            <ExploreFollowing
              search={debouncedSearchTerm}
              searching={searching}
            />
          )}
        </ReactNativeSafeAreaView>
      </View>
    </View>
  );
};
