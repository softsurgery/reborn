import { View } from "react-native";
import { cn } from "~/lib/utils";
import { InspectProfile } from "~/components/profile/InspectProfile";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";

interface MySpacePortalProps {
  className?: string;
}

export const MySpacePortal = ({ className }: MySpacePortalProps) => {
  const { currentUser } = useCurrentUser();
  return (
    <View className={cn("flex-1", className)}>
      <InspectProfile id={currentUser?.id as string} />
    </View>
  );
};
