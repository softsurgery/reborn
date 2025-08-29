import React from "react";
import { SearchInput } from "~/components/shared/SearchInput";
import { SafeAreaView, View } from "react-native";
import { cn } from "~/lib/utils";

interface JobSearchPortalProps {
  className?: string;
}

export const JobSearchPortal = ({ className }: JobSearchPortalProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <SafeAreaView className={cn("flex-1 px-4", className)}>
      <SearchInput
        placeholder="Search for jobs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus
      />
    </SafeAreaView>
  );
};
