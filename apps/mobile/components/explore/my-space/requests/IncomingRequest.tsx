import { useNavigation } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { ResponseJobRequestDto } from "~/types";
import { NavigationProps } from "~/types/app.routes";

interface IncomingRequestEntryProps {
  className?: string;
  request: ResponseJobRequestDto;
}

export const IncomingRequestEntry = ({
  className,
  request,
}: IncomingRequestEntryProps) => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <View className={cn("p-4 m border border-border rounded-lg", className)}>
      <Text>{request.job?.title}</Text>
    </View>
  );
};
