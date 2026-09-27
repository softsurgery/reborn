import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import type { ErrorBoundaryProps as EBP } from "expo-router";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps extends EBP {
  className?: string;
}

export function ErrorBoundary({ className, error, retry }: ErrorBoundaryProps) {
  return (
    <View
      className={cn(
        "flex-1 items-center justify-center p-6 bg-background",
        className,
      )}
    >
      <Text className="text-xl font-bold text-destructive mb-2 text-center">
        Something went wrong
      </Text>
      <Text className="text-sm text-muted-foreground mb-6 text-center">
        {error?.message || "An unexpected error occurred."}
      </Text>
      <Pressable
        onPress={retry}
        className="bg-primary px-6 py-3 rounded-full active:opacity-80"
      >
        <Text className="text-primary-foreground font-semibold text-sm">
          Retry
        </Text>
      </Pressable>
    </View>
  );
}
