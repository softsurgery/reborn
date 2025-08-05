import React from "react";
import { Loader } from "~/components/Loader";
import OnBoarding from "~/components/OnBoarding";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import { useNavigation } from "~/hooks/useNavigation";

export default function Screen() {
  const { isAuthenticated, isReady } = useAuthPersistStore();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!isReady) return;
    if (isAuthenticated) {
      navigation.navigate("application");
    }
  }, [isReady, isAuthenticated, navigation]);

  if (!isReady) return <Loader />;

  return <OnBoarding />;
}
