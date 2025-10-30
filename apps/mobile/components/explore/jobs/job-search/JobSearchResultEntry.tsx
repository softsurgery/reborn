import { PressableProps } from "react-native";
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
    <StablePressable {...props} className="p-4">
      <Text>{item.title}</Text>
      <Text variant={"muted"}>{item.description}</Text>
      <Text variant={"muted"} className="ml-auto">
        {timeAgo(item.createdAt)}
      </Text>
    </StablePressable>
  );
};
