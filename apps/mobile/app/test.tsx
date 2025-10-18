import React from "react";
import { Text, View } from "react-native";
import { StableKeyboardAwareScrollView } from "~/components/shared/StableKeyboardAwareScrollView";

export default function Screen() {
  return (
    <StableKeyboardAwareScrollView className="mx-4 mt-6">
      <Text className="text-foreground font-poppins text-2xl font-bold mb-6">
        Tailwind Font Weight Test (Poppins)
      </Text>

      <View className="space-y-4">
        <View>
          <Text className="text-muted-foreground text-sm">font-thin</Text>
          <Text className="text-foreground font-poppins text-xl font-thin">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">font-extralight</Text>
          <Text className="text-foreground font-poppins text-xl font-extralight">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">font-light</Text>
          <Text className="text-foreground font-poppins text-xl font-light">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">font-normal</Text>
          <Text className="text-foreground font-poppins text-xl font-normal">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">font-medium</Text>
          <Text className="text-foreground font-poppins text-xl font-medium">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">font-semibold</Text>
          <Text className="text-foreground font-poppins text-xl font-semibold">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">font-bold</Text>
          <Text className="text-foreground font-poppins text-xl font-bold">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">font-extrabold</Text>
          <Text className="text-foreground font-poppins text-xl font-extrabold">
            The quick brown fox jumps over the lazy dog.
          </Text>
          <Text className="text-foreground text-xl font-extrabold">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">font-black</Text>
          <Text className="text-foreground font-poppins text-xl font-black">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>
      </View>
    </StableKeyboardAwareScrollView>
  );
}
