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
      className={className}
      bounces={false}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === "android" ? 30 : 0}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};
