import React from "react";
import { View } from "react-native";
import { ProfileManagmentCard } from "~/components/explore/users/ProfileManagementCard";
import { Text } from "~/components/ui/text";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { Button } from "~/components/ui/button";
import { router, useNavigation } from "expo-router";
import { useClientStore } from "~/hooks/stores/useClientStore";
import { ProfileManagmentCardSkeleton } from "~/components/explore/users/ProfileManagmentCardSkeleton";
import { cn } from "~/lib/utils";
import { InspectProfile } from "./InspectProfile";
import { Separator } from "../ui/separator";

interface ManagementProps {
  className?: string;
}

export const Management = ({ className }: ManagementProps) => {
  const { currentUser } = useCurrentUser();

  return (
    <View className={cn("flex-1", className)}>
      <InspectProfile
        id={currentUser?.id as string}
        overrideContent={false}
        customContent={
          <React.Fragment>
            <Button
              onPress={() => router.push("/main/account/update-profile")}
              className="w-full"
            >
              <Text className="bold">Update Your Profile (deprecated)</Text>
            </Button>
            <Button onPress={() => {}} className="w-full">
              <Text className="bold">Update Official Documents</Text>
            </Button>
          </React.Fragment>
        }
      />
    </View>
  );
};
