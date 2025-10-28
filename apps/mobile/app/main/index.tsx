import { router } from "expo-router";
import React from "react";
import OnBoarding from "~/components/OnBoarding";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";

export default function Screen() {
  const { isAuthenticated, isReady: isAuthPersistStoreReady } =
    useAuthPersistStore();

  React.useEffect(() => {
    if (isAuthenticated && isAuthPersistStoreReady) {
      router.navigate("/main/(tabs)");
    }
  }, [isAuthenticated]);

  return <OnBoarding />;
}
