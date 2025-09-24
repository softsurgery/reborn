import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ResponseClientDto } from "./user-management";

export type StackParamList = {
  index: { reset?: true };
  // Auth
  "on-boarding": { reset?: boolean };
  "auth/sign-in": { reset?: boolean };
  "auth/sign-up": { reset?: boolean };
  "auth/sign-up-carry-on": { reset?: boolean };
  // Account
  "account/managment": { reset?: boolean };
  "account/user-preferences": { reset?: boolean };
  "account/update-profile": { reset?: boolean };
  "my-space/index": { reset?: boolean };
  "my-space/requests": {
    reset?: boolean;
    variant?: "incoming" | "outgoing";
  };

  "account/support/report-bug": { reset?: boolean };
  "account/support/send-feedback": { reset?: boolean };
  "account/support/faqs": { reset?: boolean };

  // Chat
  "chat/conversation": { id?: number; reset?: boolean };
  // Explore
  "explore/new-job": { reset?: boolean };
  "explore/job-details": { id?: string; uploads: number[]; reset?: boolean };
  "explore/job-search": { reset?: boolean };
  "explore/user-profile": { id?: string; reset?: boolean };
  test: { reset?: boolean };
  //balance
  balance: { reset?: boolean };
};

export type NavigationProps = NativeStackNavigationProp<StackParamList>;
