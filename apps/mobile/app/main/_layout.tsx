import React from "react";
import { Stack } from "expo-router";
import { useCheckHealth } from "~/hooks/content/useCheckHealth";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import { useColorPalette } from "@/hooks/useColorPalette";
import { NotificationType } from "@/types";
import { useNotifications } from "@/hooks/content/notifications/useNotification";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationContext } from "@/contexts/NotificationContext";
import { ChatContext } from "@/contexts/ChatContext";
import { useChatPendingSync } from "@/hooks/content/chat/useChatPendingSync";
import { useChat } from "@/hooks/content/chat/useChat";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function MainLayout() {
  const authPersistStore = useAuthPersistStore();
  const { palette } = useColorPalette();
  const queryClient = useQueryClient();
  useCheckHealth({
    enabled: authPersistStore.isAuthenticated,
  });

  const { count: chatCount, resetCount: resetChatCount } = useChat({});
  useChatPendingSync();
  const {
    count: notificationCount,
    notifications,
    resetCount: resetNotificationCount,
  } = useNotifications({
    consequences: {
      [NotificationType.TEST]: () => {},
      [NotificationType.NEW_SIGNIN]: () => {},
      [NotificationType.NEW_MESSAGE]: () => {},
      [NotificationType.JOB_REQUEST_APPROVED]: () => {
        queryClient.invalidateQueries({ queryKey: ["requests", "outgoing"] });
      },
      [NotificationType.JOB_REQUEST_REJECTED]: () => {
        queryClient.invalidateQueries({ queryKey: ["requests", "outgoing"] });
      },
      [NotificationType.NEW_JOB_REQUEST]: () => {
        queryClient.invalidateQueries({ queryKey: ["requests", "incoming"] });
      },
      [NotificationType.NEW_FOLLOWER]: () => {
        queryClient.invalidateQueries({ queryKey: ["followers"] });
        queryClient.invalidateQueries({ queryKey: ["follow-data-count"] });
        queryClient.invalidateQueries({ queryKey: ["social-data"] });
      },
    },
  });

  React.useEffect(() => {
    queryClient.invalidateQueries();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        count: notificationCount,
        notifications,
        resetCount: resetNotificationCount,
      }}
    >
      <ChatContext.Provider
        value={{
          count: chatCount,
          resetCount: resetChatCount,
        }}
      >
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "",
              headerShown: false,
              animation: "fade_from_bottom",
              animationDuration: 200,
            }}
          />
          {/* Main Application */}
          <Stack.Screen
            name="(tabs)"
            options={{
              title: "",
              headerShown: false,
              animation: "fade_from_bottom",
              animationDuration: 200,
            }}
          />
          {/* Account *********************************************************************************************************************/}
          <Stack.Screen
            name="account/email-success"
            options={{
              title: "",
              headerShown: false,
              animation: "fade_from_bottom",
              animationDuration: 200,
            }}
          />
          <Stack.Screen
            name="account/inspect-profile"
            options={{
              title: "My Profile",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="account/update-profile"
            options={{
              headerShown: false,
              title: "Update Profile",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="account/user-preferences"
            options={{
              title: "User Preferences",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="account/support/report-bug"
            options={{
              headerShown: false,
              title: "Report a Bug",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="account/support/send-feedback"
            options={{
              headerShown: false,
              title: "Send us feedback",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="account/support/faqs"
            options={{
              headerShown: false,
              title: "FAQs",
              animation: "slide_from_right",
            }}
          />
          {/* Career *********************************************************************************************************************/}
          <Stack.Screen
            name="account/career/create-experience"
            options={{
              title: "Create Experience",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="account/career/update-experiences"
            options={{
              title: "Experiences",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="account/career/update-experience"
            options={{
              title: "Edit Experience",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="account/career/delete-experience"
            options={{
              title: "Delete Experience",
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="account/career/create-education"
            options={{
              title: "Create Education",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="account/career/update-education"
            options={{
              title: "Edit Education",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="account/career/update-educations"
            options={{
              title: "Educations",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="account/career/delete-education"
            options={{
              title: "Delete Education",
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="account/create-skill"
            options={{
              title: "Create Skill",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="account/update-skills"
            options={{
              title: "Update Skills",
              headerShown: false,
            }}
          />

          {/* Explore *********************************************************************************************************************/}

          <Stack.Screen
            name="explore/job-search"
            options={{
              title: "",
              animation: "slide_from_bottom",
              animationDuration: 300,
              headerStyle: {
                backgroundColor: palette.background,
              },
            }}
          />
          <Stack.Screen
            name="explore/job-details"
            options={{
              title: "",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="explore/job-apply"
            options={{
              title: "",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="explore/inspect-profile"
            options={{
              title: "",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />

          <Stack.Screen
            name="connections"
            options={{
              title: "",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />

          {/* My Space *********************************************************************************************************************/}
          <Stack.Screen
            name="my-space/requests"
            options={{
              title: "Requests",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="my-space/request-details"
            options={{
              title: "Request Details",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="my-space/quick-actions/saved"
            options={{
              title: "saved",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="my-space/quick-actions/work"
            options={{
              title: "Work",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="my-space/quick-actions/jobs"
            options={{
              title: "My Jobs",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="my-space/quick-actions/viewed"
            options={{
              title: "Viewed",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="my-space/new-job"
            options={{
              headerShown: false,
              title: "New Job",
            }}
          />
          <Stack.Screen
            name="my-space/update-job"
            options={{
              title: "Update Job",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="my-space/manage-job"
            options={{
              title: "Manage Job",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="my-space/request-update"
            options={{
              title: "Update Job Application",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />

          <Stack.Screen
            name="explore/job-filters"
            options={{
              title: "Job Filters",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />

          {/* Notifications *********************************************************************************************************************/}
          <Stack.Screen
            name="notifications"
            options={{
              title: "Notifications",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="settings/index"
            options={{
              title: "Settings",
              headerShown: false,
              animation: "fade_from_bottom",
              animationDuration: 200,
            }}
          />
          <Stack.Screen
            name="settings/terms"
            options={{
              title: "Terms & Conditions",
              headerShown: false,
              animation: "fade_from_bottom",
              animationDuration: 200,
            }}
          />
          <Stack.Screen
            name="settings/privacy-policy"
            options={{
              title: "Privacy Policy",
              headerShown: false,
              animation: "fade_from_bottom",
              animationDuration: 200,
            }}
          />
          <Stack.Screen
            name="settings/about"
            options={{
              title: "About Reborn",
              headerShown: false,
              animation: "fade_from_bottom",
              animationDuration: 200,
            }}
          />
          <Stack.Screen
            name="settings/privacy-security"
            options={{
              title: "Privacy & Security",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="settings/theme"
            options={{
              title: "Theme",
              headerShown: false,
              animation: "fade_from_bottom",
              animationDuration: 200,
            }}
          />
          <Stack.Screen
            name="settings/language"
            options={{
              title: "Language",
              headerShown: false,
              animation: "fade_from_bottom",
              animationDuration: 200,
            }}
          />
          <Stack.Screen
            name="account/change-email"
            options={{
              title: "Change Email",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="account/change-password"
            options={{
              title: "Change Password",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="settings/verify-email"
            options={{
              title: "Verify Email",
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          {/* Chat  ********************************************************************************************* */}

          <Stack.Screen
            name="chat/conversation"
            options={{
              title: "",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="chat/conversation-details"
            options={{
              title: "conversationDetails",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="chat/report-conversation"
            options={{
              title: "reportConversation",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="chat/conversation-resource-details"
            options={{
              title: "mediaFilesLinks",
              headerShown: false,
            }}
          />
          {/* Test */}
          <Stack.Screen
            name="test"
            options={{
              title: "TEST",
              animation: "slide_from_right",
            }}
          />
        </Stack>
      </ChatContext.Provider>
    </NotificationContext.Provider>
  );
}
