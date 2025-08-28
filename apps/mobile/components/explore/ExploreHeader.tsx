import { View } from "react-native";
import { SearchInput } from "../shared/SearchInput";
import { cn } from "~/lib/utils";
import { JobFilters } from "./jobs/JobFilters";
import { useNavigation } from "~/hooks/useNavigation";

interface ExploreHeaderProps {
  className?: string;
}

export const ExploreHeader = ({ className }: ExploreHeaderProps) => {
  const { navigate } = useNavigation();
  return (
    <View className={cn("flex flex-row items-center gap-4", className)}>
      <SearchInput
        placeholder="Search for jobs..."
        className="w-[80%]"
        // disabled={true}
        onClick={() => navigate("explore/job-search")}
      />
      <JobFilters />
    </View>
  );
};
