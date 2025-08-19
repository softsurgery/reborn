import React from "react";
import { Platform, ScrollView } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-aware-scroll-view";
import { wrapScrollView } from "react-native-scroll-into-view";

interface StableKeyboardAwareScrollViewProps
  extends KeyboardAwareScrollViewProps {
  className?: string;
  children?: React.ReactNode;
}

const ScrollIntoView = wrapScrollView(ScrollView);

export const StableKeyboardAwareScrollView = React.forwardRef<
  KeyboardAwareScrollView,
  StableKeyboardAwareScrollViewProps
>(({ className, children, ...props }, ref) => {
  return (
    <ScrollIntoView>
      <KeyboardAwareScrollView
        {...props}
        ref={ref}
        className={className}
        bounces={false}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "android" ? 30 : 0}
      >
        {children}
      </KeyboardAwareScrollView>
    </ScrollIntoView>
  );
});

StableKeyboardAwareScrollView.displayName = "StableKeyboardAwareScrollView";
