import React from "react";
import { View } from "react-native";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

// Skeleton block utility
const SkeletonBlock = ({ className }: { className?: string }) => (
  <View className={cn("bg-muted-foreground/20 rounded-md", className)} />
);

export const ProfileManagmentCardSkeleton = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <Card className={cn("w-full items-center justify-center", className)}>
      <CardHeader className="w-full">
        <View className="flex flex-row justify-between items-center">
          {/* avatar */}
          <Skeleton className="w-[30%] aspect-square rounded-full" />

          {/* info block */}
          <View className="flex flex-col justify-between gap-4 w-[60%]">
            {/* identity */}
            <Skeleton className="h-5 w-1/2" />

            {/* stats */}
            <View className="flex flex-row gap-12 w-full">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-10" />
            </View>
          </View>
        </View>
      </CardHeader>

      <CardContent className="w-full">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>

      <CardFooter className="w-full">
        <View className="flex flex-row w-full justify-between gap-2">
        </View>
      </CardFooter>
    </Card>
  );
};
