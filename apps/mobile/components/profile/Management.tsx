import React from "react";
import { View } from "react-native";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { cn } from "~/lib/utils";
import { InspectProfile } from "./InspectProfile";

interface ManagementProps {
  className?: string;
}

export const Management = ({ className }: ManagementProps) => {
  const { currentUser } = useCurrentUser();

  return (
    <View className={cn("flex-1", className)}>
      <InspectProfile id={currentUser?.id as string} />
    </View>
  );
};
