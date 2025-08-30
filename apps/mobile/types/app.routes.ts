import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ResponseClientDto } from "./user-management";

export type StackParamList = {
  index: undefined;
  // Auth
  "on-boarding": undefined;
  "auth/sign-in": undefined;
  "auth/sign-up": undefined;
  "auth/sign-up-carry-on": undefined;
  // Account
  "account/managment": undefined;
  "account/user-preferences": undefined;
  "account/update-profile": undefined;

  "account/support/report-bug": undefined;
  "account/support/send-feedback": undefined;
  "account/support/faqs": undefined;
  // Chat
  "chat/conversation": { user?: ResponseClientDto };
  // Explore
  "explore/job-details": { id?: string; uploads: number[] };
  "explore/job-search": undefined;
  "explore/user-profile": { id?: string };
  test: undefined;
  //balance
  balance: undefined;
};

export type NavigationProps = NativeStackNavigationProp<StackParamList>;
