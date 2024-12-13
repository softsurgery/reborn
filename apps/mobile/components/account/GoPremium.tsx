import { Image, View } from "react-native";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";

interface GoPremiumProps {
  className?: string;
}

export const GoPremium = ({ className }: GoPremiumProps) => {
  return (
    <View className={cn("border-4 border-yellow-400 rounded-lg", className)}>
      <View>
        <Text className="text-center bg-yellow-400 text-2xl py-2 font-bold">
          Go Premium
        </Text>
      </View>
      <View className="py-3 px-5 flex flex-col gap-2">
        <View className="flex flex-row gap-4 items-center">
          <Text className="text-justify w-2/3">
            Get Automated monitoring advanced protection, and top-tier internet
            blocking options
          </Text>
          <View className="w-1/3 flex items-center">
            <Image
              className="shadow-md h-24 w-32 "
              source={require("~/assets/images/20-discount.png")}
            />
          </View>
        </View>
        <Text className="text-justify">
          Start your 7 days free trial then 59.990 TND per Year Only
        </Text>
      </View>
    </View>
  );
};
