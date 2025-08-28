import React from "react";
import { SearchInput } from "~/components/shared/SearchInput";
import { View } from "react-native";
import { cn } from "~/lib/utils";

interface JobSearchPortalProps {
  className?: string;
}

export const JobSearchPortal = ({ className }: JobSearchPortalProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <View className={cn("flex-1 px-4", className)}>
      <SearchInput
        placeholder="Search for jobs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus
      />
    </View>
  );
};
