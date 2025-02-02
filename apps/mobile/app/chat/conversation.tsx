import { useRoute } from "@react-navigation/native";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text } from "~/components/ui/text";
import { User } from "~/types";

export default function Screen() {
  const route = useRoute();
  const { user } = route.params as { user: User };

  return (
    <KeyboardAwareScrollView bounces={false}>
      <View className="my-20 mx-5">
        <Text>{user.name}</Text>
      </View>
    </KeyboardAwareScrollView>
  );
}
