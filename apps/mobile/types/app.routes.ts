import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

type StackParamList = {
  "on-boarding": undefined;
  "auth/sign-in-screen": undefined;
  "auth/sign-up-screen": undefined;
  success: undefined;
};

export type NavigationProps = NativeStackNavigationProp<StackParamList>