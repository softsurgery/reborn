import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { User } from "./User";

export type StackParamList = {
  "index": undefined;
  application: undefined;
  // Auth
  "on-boarding": undefined;
  "auth/sign-in-screen": undefined;
  "auth/sign-up-screen": undefined;
  // Account
  "settings/app-settings/user-preferences": undefined;
  "settings/support/report-bug": undefined;
  "settings/support/send-feedback": undefined;
  "settings/app-settings/profile-managment": undefined;
  "settings/app-settings/update-profile": undefined;
  // Chat
  "chat/conversation": { user?: User };
};

export type NavigationProps = NativeStackNavigationProp<StackParamList>