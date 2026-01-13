import { Image, Platform, View } from "react-native";
import { Button } from "../ui/button";
import { useColorScheme } from "nativewind";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";

export interface SSOButtonsProps {
  className?: string;
  isSignInPending: boolean;
}

export const SSOButtons = ({ className, isSignInPending }: SSOButtonsProps) => {
  const { colorScheme } = useColorScheme();
  return (
    <View className={cn("flex flex-col justify-center gap-2", className)}>
      {Platform.OS === "ios" && (
        <Button
          disabled={isSignInPending}
          variant={"outline"}
          className="flex flex-row w-fit gap-2"
        >
          <Image
            className="w-6 h-6 shadow-md"
            source={
              colorScheme === "dark"
                ? require("~/assets/images/apple-dark.png")
                : require("~/assets/images/apple.png")
            }
          />
          <Text className="text-lg font-bold text-foreground">
            Continue with Apple
          </Text>
        </Button>
      )}
      <Button
        disabled={isSignInPending}
        className="flex flex-row w-fit gap-2 bg-red-600"
      >
        <Image
          className="w-6 h-6 shadow-md"
          source={require("~/assets/images/google.png")}
        />
        <Text className="text-lg font-bold text-white">
          Continue with Google
        </Text>
      </Button>
    </View>
  );
};
