import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { ResponseUserDto } from "./user-management";

export type StackParamList = {
  index: undefined;
  // Auth
  "on-boarding": undefined;
  "auth/sign-in": undefined;
  "auth/sign-up": undefined;
  "auth/sign-up-carry-on": undefined;
  // Account
  application: undefined;
  "account/managment": undefined;
  "account/preferences": undefined;
  "account/update-profile": undefined;

  "account/support/report-bug": undefined;
  "account/support/send-feedback": undefined;
  "account/support/faqs": undefined;
  // Chat
  "chat/conversation": { user?: ResponseUserDto };
  // Jobs
  "job-details": { job: string };
};

export type NavigationProps = NativeStackNavigationProp<StackParamList>;
