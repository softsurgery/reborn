import { SafeAreaView as NativeSafeAreaView, Platform } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

interface StableSafeAreaViewProps extends SafeAreaViewProps {
  children: React.ReactNode;
}

export const StableSafeAreaView = ({
  children,
  ...props
}: StableSafeAreaViewProps) => {
  if (Platform.OS === "android")
    return <SafeAreaView {...props}>{children}</SafeAreaView>;

  return <NativeSafeAreaView {...props}>{children}</NativeSafeAreaView>;
};
