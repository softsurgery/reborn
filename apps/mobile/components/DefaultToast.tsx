import { View } from "react-native";
import { Text } from "./ui/text";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";

export const DefaultToast = ({ message }: { message: string }) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View
      style={{
        backgroundColor: isDarkColorScheme ? NAV_THEME.dark.card : NAV_THEME.light.card,
        borderRadius: 10,
        padding: 10,
        margin: 10,
      }}
    >
      <Text>{message}</Text>
    </View>
  );
};
