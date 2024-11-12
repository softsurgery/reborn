import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

type StackParamList = {
  "index" : undefined;
  "on-boarding": undefined;
  "auth/sign-in-screen": undefined;
  "auth/sign-up-screen": undefined;
  application: undefined;
};

export type NavigationProps = NativeStackNavigationProp<StackParamList>