import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

export type StackParamList = {
  "index": undefined;
  "on-boarding": undefined;
  "auth/sign-in-screen": undefined;
  "auth/sign-up-screen": undefined;
  "settings/app-settings/user-preferences": undefined;
  "settings/support/report-bug": undefined;
  "settings/support/send-feedback": undefined;
  application: undefined;
};

export type NavigationProps = NativeStackNavigationProp<StackParamList>