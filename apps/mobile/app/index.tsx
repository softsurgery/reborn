import React from "react";
import OnBoarding from "~/components/OnBoarding";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import { useNavigation } from "~/hooks/useNavigation";

export default function Screen() {
  const authPersistStore = useAuthPersistStore();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (authPersistStore.isAuthenticated) {
      navigation.navigate("application");
    }
  }, [authPersistStore.isAuthenticated, navigation]);

  return <OnBoarding />;
}
