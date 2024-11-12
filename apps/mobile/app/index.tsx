import * as React from "react";
import { View } from "react-native";
import { useAuthFunctions } from "~/hooks/useAuthFunctions";
import OnBoarding from "~/components/OnBoarding";
import Application from "~/components/Application";

export default function Screen() {
  const { isAuthenticated, isLoading } = useAuthFunctions();

  if (isLoading) {
    return <View></View>;
  } else if (!isAuthenticated) return <OnBoarding />;
  else if (isAuthenticated) return <Application />;
  else return null;
}
