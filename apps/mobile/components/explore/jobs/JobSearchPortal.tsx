import React from "react";
import { SearchInput } from "~/components/shared/SearchInput";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { cn } from "~/lib/utils";
import { JobFilters } from "./JobFilters";

interface JobSearchPortalProps {
  className?: string;
}

export const JobSearchPortal = ({ className }: JobSearchPortalProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <StableSafeAreaView
      className={cn(
        "flex flex-row gap-4 justify-center items-center px-4",
        className
      )}
    >
      <SearchInput
        placeholder="Search for jobs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus
        className="flex-1"
      />
      <JobFilters />
    </StableSafeAreaView>
  );
};
