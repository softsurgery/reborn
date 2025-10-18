import React from "react";
import { Text, View } from "react-native";
import { StableKeyboardAwareScrollView } from "~/components/shared/StableKeyboardAwareScrollView";

export default function Screen() {
  return (
    <StableKeyboardAwareScrollView className="p-4">
      <Text className="text-foreground text-2xl font-bold mb-6">
        Poppins Font Test
      </Text>

      <View className="space-y-4">
        <View>
          <Text className="text-muted-foreground text-sm">Poppins-Black</Text>
          <Text
            style={{ fontFamily: "Poppins-Black" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">
            Poppins-BlackItalic
          </Text>
          <Text
            style={{ fontFamily: "Poppins-BlackItalic" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">Poppins-Bold</Text>
          <Text
            style={{ fontFamily: "Poppins-Bold" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">
            Poppins-BoldItalic
          </Text>
          <Text
            style={{ fontFamily: "Poppins-BoldItalic" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">
            Poppins-ExtraBold
          </Text>
          <Text
            style={{ fontFamily: "Poppins-ExtraBold" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">
            Poppins-ExtraBoldItalic
          </Text>
          <Text
            style={{ fontFamily: "Poppins-ExtraBoldItalic" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">
            Poppins-ExtraLight
          </Text>
          <Text
            style={{ fontFamily: "Poppins-ExtraLight" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">
            Poppins-ExtraLightItalic
          </Text>
          <Text
            style={{ fontFamily: "Poppins-ExtraLightItalic" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">Poppins-Italic</Text>
          <Text
            style={{ fontFamily: "Poppins-Italic" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">Poppins-Light</Text>
          <Text
            style={{ fontFamily: "Poppins-Light" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">
            Poppins-LightItalic
          </Text>
          <Text
            style={{ fontFamily: "Poppins-LightItalic" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">Poppins-Medium</Text>
          <Text
            style={{ fontFamily: "Poppins-Medium" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">
            Poppins-MediumItalic
          </Text>
          <Text
            style={{ fontFamily: "Poppins-MediumItalic" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">
            Poppins (Regular)
          </Text>
          <Text
            style={{ fontFamily: "Poppins" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">
            Poppins-SemiBold
          </Text>
          <Text
            style={{ fontFamily: "Poppins-SemiBold" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">
            Poppins-SemiBoldItalic
          </Text>
          <Text
            style={{ fontFamily: "Poppins-SemiBoldItalic" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">Poppins-Thin</Text>
          <Text
            style={{ fontFamily: "Poppins-Thin" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View>
          <Text className="text-muted-foreground text-sm">
            Poppins-ThinItalic
          </Text>
          <Text
            style={{ fontFamily: "Poppins-ThinItalic" }}
            className="text-foreground text-xl"
          >
            The quick brown fox jumps over the lazy dog.
          </Text>
        </View>
      </View>
    </StableKeyboardAwareScrollView>
  );
}
