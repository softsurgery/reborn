import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";

interface PlanInfoProps {
  className?: string;
  plan?: string;
}

export const PlanInfo = ({ className, plan }: PlanInfoProps) => {
  return (
    <View>
      <View className={cn("flex flex-row justify-between items-center", className)}>
        <Text className="text-xl font-semibold">Your Plan</Text>
        <Badge className="flex justify-center bg-primary py-1 px-5">
          <Text className="text-base p-0.5 font-bold">Free</Text>
        </Badge>
      </View>
    </View>
  );
};
