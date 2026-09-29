import { cn } from "@reborn/lib";
import { View } from "react-native";
import { InspectBaseProfile } from "../profile/BaseProfile";
import { ApplicationHeader } from "@reborn/mobile-components";
import { StableSafeAreaView } from "@reborn/mobile-components";
import { AppHeaderBack } from "@reborn/mobile-components";

interface InspectProfileProps {
  className?: string;
  id: string;
}

import { UserStoreProvider } from "@/hooks/stores/useUserStore";

export const InspectProfile = ({ className, id }: InspectProfileProps) => {
  return (
    <UserStoreProvider>
      <View className={cn("flex-1", className)}>
        <InspectBaseProfile
          id={id}
          coverExtra={
            <StableSafeAreaView
              className="absolute top-0 left-0 right-0 z-30"
              pointerEvents="box-none"
            >
              <ApplicationHeader
                title=""
                shortcuts={[
                  {
                    key: "settings",
                    render: <AppHeaderBack />,
                  },
                ]}
              />
            </StableSafeAreaView>
          }
        />
      </View>
    </UserStoreProvider>
  );
};
