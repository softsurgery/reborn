import React from "react";
import { SearchInput } from "~/components/shared/SearchInput";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { cn } from "~/lib/utils";

interface JobSearchPortalProps {
  className?: string;
}

export const JobSearchPortal = ({ className }: JobSearchPortalProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <StableSafeAreaView className={cn("flex-1 px-4", className)}>
      <SearchInput
        placeholder="Search for jobs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus
      />
    </StableSafeAreaView>
  );
};
