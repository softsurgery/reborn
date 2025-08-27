import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  ViewStyle,
  LayoutAnimation,
} from "react-native";
import { wrapScrollView } from "react-native-scroll-into-view";

interface StableKeyboardAwareScrollViewProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const ScrollIntoView = wrapScrollView(ScrollView);

export const StableKeyboardAwareScrollView = React.forwardRef<
  ScrollView,
  StableKeyboardAwareScrollViewProps
>(({ className, style, children, ...props }, ref) => {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      className={className}
    >
      <ScrollIntoView
        innerRef={ref}
        contentContainerStyle={[
          {
            flexGrow: 1,
            paddingBottom: Platform.OS === "ios" ? 20 : keyboardHeight + 20,
          },
          style,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollIntoView>
    </KeyboardAvoidingView>
  );
});

StableKeyboardAwareScrollView.displayName = "StableKeyboardAwareScrollView";
