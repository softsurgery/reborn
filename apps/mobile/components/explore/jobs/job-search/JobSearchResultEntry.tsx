import { View } from "react-native";
import {
  StablePressable,
  StablePressableProps,
} from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import { timeAgo } from "~/lib/dates.utils";
import { ResponseJobDto } from "~/types";

interface JobSearchResultEntryProps extends StablePressableProps {
  className?: string;
  item: ResponseJobDto;
}

export const JobSearchResultEntry = ({
  className,
  item,
  ...props
}: JobSearchResultEntryProps) => {
  return (
    <StablePressable
      {...props}
      className="p-4 flex-row items-start justify-between"
    >
      <View className="flex-1">
        <Text className="font-semibold">{item.title}</Text>
        <Text variant="muted" className="truncate" numberOfLines={3}>
          {item.description}
        </Text>
      </View>
      <Text variant="muted" className="ml-2 shrink-0">
        {timeAgo(item.createdAt)}
      </Text>
    </StablePressable>
  );
};
