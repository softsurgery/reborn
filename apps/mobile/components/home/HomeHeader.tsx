import { View } from "react-native";
import { SearchInput } from "../shared/SearchInput";
import { cn } from "~/lib/utils";
import { JobFilters } from "./JobFilters";

interface HomePageHeaderProps {
  className?: string;
  search: string;
  setSearch: (search: string) => void;
}

export const HomePageHeader = ({
  className,
  search,
  setSearch,
}: HomePageHeaderProps) => {
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
