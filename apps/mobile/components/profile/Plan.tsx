import { Image, View } from "react-native";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";
import { Badge } from "../ui/badge";

interface PlanInfoProps {
  className?: string;
  plan?: string;
}

export const PlanInfo = ({ className, plan }: PlanInfoProps) => {
  return (
    <View>
      <View className={cn("flex flex-row justify-between items-center", className)}>
        <Text className="text-xl font-semibold">Your Plan</Text>
        <Badge className="flex justify-center bg-green-600 py-1 px-5">
          <Text className="text-base p-0.5 text-white font-bold">Free</Text>
        </Badge>
      </View>
    </View>
  );
};
