import { Platform } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-aware-scroll-view";

interface StableKeyboardAwareScrollViewProps
  extends KeyboardAwareScrollViewProps {
  className?: string;
  children: React.ReactNode;
}

export const StableKeyboardAwareScrollView = ({
  className,
  children,
  ...props
}: StableKeyboardAwareScrollViewProps) => {
  return (
    <KeyboardAwareScrollView
      {...props}
      bounces={false}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === "android" ? 30 : 0}
      className={className}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};
