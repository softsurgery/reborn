import { useQueryClient } from "@tanstack/react-query";
import { disconnectAllSockets } from "@/lib/socket";
import { router } from "expo-router";
import { useAuthPersistStore } from "./stores/useAuthPersistStore";
import { useUserStore } from "./stores/useUserStore";
import { useAuthStore } from "./stores/useAuthStore";
import { useExploreFilterStore } from "./stores/userExploreFilterStore";
import { useReportBugStore } from "./stores/useReportBugStore";
import { useSendFeedbackStore } from "./stores/useFeedbackManager";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const authPersistStore = useAuthPersistStore();
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const exploreFilterStore = useExploreFilterStore();
  const reportBugStore = useReportBugStore();
  const sendFeedbackStore = useSendFeedbackStore();

  const logout = () => {
    // 1. Clear query cache
    queryClient.clear();

    // 2. Clear persist auth token
    authPersistStore.logout?.();

    // 3. Reset all zustand stores
    userStore.reset();
    authStore.reset();
    exploreFilterStore.reset();
    reportBugStore.reset();
    sendFeedbackStore.reset();

    // 4. Disconnect all sockets
    disconnectAllSockets();

    // 5. Navigate to splash / login
    router.replace("/");
  };

  return logout;
};
