import { View } from "react-native";
import { SearchInput } from "../shared/SearchInput";
import { cn } from "~/lib/utils";
import { JobFilters } from "./jobs/JobFilters";

interface ExploreHeaderProps {
  className?: string;
  search: string;
  setSearch: (search: string) => void;
}

export const ExploreHeader = ({
  className,
  search,
  setSearch,
}: ExploreHeaderProps) => {
  return (
    <View className={cn("flex flex-row items-center gap-4", className)}>
      <SearchInput
        placeholder="Search for jobs..."
        value={search}
        onChangeText={(search) => setSearch(search)}
        className="w-[80%]"
      />
      <JobFilters />
    </View>
  );
};
