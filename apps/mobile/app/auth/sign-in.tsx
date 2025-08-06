import { useNavigation } from "expo-router";
import React from "react";
import { SignInLayout } from "~/components/auth/SignInLayout";
import { BackButton } from "~/components/BackButton";

export default function Screen() {
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton route="index" />,
    });
  }, [navigation]);

  return <SignInLayout />;
}
