import { View } from "react-native";
import { cn } from "~/lib/utils";
import { JobFilters } from "./jobs/JobFilters";
import { useNavigation } from "~/hooks/useNavigation";
import { Button } from "../ui/button";
import { Search } from "lucide-react-native";
import { Text } from "../ui/text";
import Icon from "~/lib/Icon";

interface ExploreHeaderProps {
  className?: string;
}

export const ExploreHeader = ({ className }: ExploreHeaderProps) => {
  const { navigate } = useNavigation();
  return (
    <View
      className={cn(
        "flex flex-row justify-between items-center gap-2 px-2",
        className
      )}
    >
      <Text variant={"h1"}>Explore</Text>
      <View className="flex flex-row items-center">
        <Button variant="none" onPress={() => navigate("explore/job-search")}>
          <Icon name={Search} size={28} />
        </Button>
        <JobFilters />
      </View>
    </View>
  );
};
