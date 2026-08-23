import React from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";

export interface InfiniteListFooterProps {
  isPending: boolean;
  hasNextPage: boolean;
  dataLength: number;
  loadingComponent?: React.ReactNode;
  loadingCount?: number;
  endMessage?: string;
  showEndMessage?: boolean;
  className?: string;
}

export const InfiniteListFooter: React.FC<InfiniteListFooterProps> = ({
  isPending,
  hasNextPage,
  dataLength,
  loadingComponent,
  loadingCount = 1,
  endMessage = "You have caught up with everything",
  showEndMessage = true,
  className,
}) => {
  return (
    <View className={cn("items-center mb-8 px-4", className)}>
      {isPending ? (
        <>
          {Array.from({ length: loadingCount }).map((_, index) => (
            <React.Fragment key={index}>{loadingComponent}</React.Fragment>
          ))}
        </>
      ) : showEndMessage && !hasNextPage && dataLength > 0 ? (
        <View className="flex flex-row items-center justify-center gap-2 py-6">
          <Text variant="p" className="text-muted-foreground">
            {endMessage}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
