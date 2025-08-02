import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { User } from "./User";
import { Job } from "./Job";

export type StackParamList = {
  index: undefined;
  application: undefined;
  // Auth
  "on-boarding": undefined;
  "auth/sign-in-screen": undefined;
  "auth/sign-up-screen": undefined;
  // Account
  "account/managment": undefined;
  "account/preferences": undefined;
  "account/update-profile": undefined;

  "account/support/report-bug": undefined;
  "account/support/send-feedback": undefined;
  "account/support/faqs": undefined;
  // Chat
  "chat/conversation": { user?: User };
  // Jobs
  "job-details": { job: string };
};

export type NavigationProps = NativeStackNavigationProp<StackParamList>;
