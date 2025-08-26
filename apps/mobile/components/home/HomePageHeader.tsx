import { SearchInput } from "../shared/SearchInput";
import { Text } from "../ui/text";
import { FilterChoices } from "../shared/FilterChoices";
import { Separator } from "../ui/separator";
import { View } from "react-native";
import { cn } from "~/lib/utils";

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
    <View className={cn(className)}>
      <SearchInput
        placeholder="Search for jobs..."
        value={search}
        onChangeText={(search) => setSearch(search)}
      />

      <View className="flex flex-col gap-2">
        <Text className="text-gray-800 dark:text-gray-200 text-sm">
          Filter Jobs
        </Text>
        <Separator />
      </View>
      <FilterChoices />
    </View>
  );
};
