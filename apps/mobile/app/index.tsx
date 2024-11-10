import * as React from "react";
import { useAuthFunctions } from "~/hooks/useAuthFunctions";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";

export default function Screen() {
  const navigation = useNavigation<NavigationProps>();
  const { isAuthenticated } = useAuthFunctions();
  if (isAuthenticated) {
    navigation.navigate("success");
  } else navigation.navigate("on-boarding");
}
