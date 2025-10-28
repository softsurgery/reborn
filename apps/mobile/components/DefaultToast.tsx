import { View } from "react-native";
import { Text } from "./ui/text";
import { useColorScheme } from "nativewind";
import { NAV_THEME } from "~/lib/theme";

export const DefaultToast = ({ message }: { message: string }) => {
  const { colorScheme } = useColorScheme();
  const isDarkColorScheme = colorScheme === "dark";
  return (
    <View
      style={{
        backgroundColor: isDarkColorScheme
          ? NAV_THEME.dark.colors.card
          : NAV_THEME.light.colors.card,
        borderRadius: 10,
        padding: 10,
        margin: 10,
      }}
    >
      <Text>{message}</Text>
    </View>
  );
};
