import React from "react";
import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuthFunctions } from "~/hooks/useAuthFunctions";

export default function NotFoundScreen() {
  const { isAuthenticated } = useAuthFunctions();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View>
        <Text>This screen doesn't exist.</Text>

        <Link href={isAuthenticated ? '/success' : '/on-boarding'}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
