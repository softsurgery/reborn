import { View } from "react-native";
import { cn } from "~/lib/utils";
import { JobFilters } from "./jobs/JobFilters";
import { useNavigation } from "~/hooks/useNavigation";
import { Button } from "../ui/button";
import { Search } from "lucide-react-native";
import { Text } from "../ui/text";

interface ExploreHeaderProps {
  className?: string;
}

export const ExploreHeader = ({ className }: ExploreHeaderProps) => {
  const { navigate } = useNavigation();
  return (
    <View
      className={cn(
        "flex flex-row justify-between items-center gap-3 py-4",
        className
      )}
    >
      <Button
        variant="none"
        className="flex-1 flex-row justify-start rounded border border-input px-2 py-2"
        onPress={() => navigate("explore/job-search")}
      >
        <Search size={20} color="#9ca3af" />
        <View className="ml-2">
          <Text className="text-gray-400 text-base">Search for jobs...</Text>
        </View>
      </Button>
      <JobFilters />
    </View>
  );
};
