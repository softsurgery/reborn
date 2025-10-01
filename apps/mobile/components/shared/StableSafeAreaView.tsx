import { Platform, StatusBar } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

import { cn } from "~/lib/utils";

interface StableSafeAreaViewProps extends SafeAreaViewProps {
  children: React.ReactNode;
}

export const StableSafeAreaView = ({
  className,
  children,
  ...props
}: StableSafeAreaViewProps) => {
  return (
    <SafeAreaView
      className={cn(className)}
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
      {...props}
      edges={["left", "right"]}
    >
      {children}
    </SafeAreaView>
  );
};
