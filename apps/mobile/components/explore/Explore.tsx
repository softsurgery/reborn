import React from "react";
import { View, SafeAreaView as ReactNativeSafeAreaView } from "react-native";
import { ExploreHeader } from "./ExploreHeader";
import { useDebounce } from "~/hooks/useDebounce";
import { ExploreCommon } from "./ExploreCommon";
import { Text } from "../ui/text";
import { ExploreFollowing } from "./ExploreFollowing";
import { cn } from "~/lib/utils";
import { StablePressable } from "../shared/StablePressable";

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
      <View className="flex flex-row gap-2 pt-2">
        <StablePressable
          onPress={() => setTab("recent")}
          className={cn(
            "h-12 w-1/2 flex items-center justify-center",
            tab === "recent" ? "border-b-2 border-b-primary" : ""
          )}
        >
          <Text>Recent</Text>
        </StablePressable>
        <StablePressable
          onPress={() => setTab("followings")}
          className={cn(
            "h-12 w-1/2 flex items-center justify-center",
            tab === "followings" ? "border-b-2 border-b-primary" : ""
          )}
        >
          <Text>Followings</Text>
        </StablePressable>
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
