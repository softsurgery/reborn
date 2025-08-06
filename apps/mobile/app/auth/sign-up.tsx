import { useNavigation } from "expo-router";
import React from "react";
import { SignUpLayout } from "~/components/auth/SignUpLayout";
import { BackButton } from "~/components/BackButton";

export default function Screen() {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton route="index" />,
    });
  }, [navigation]);
  return <SignUpLayout />;
}
