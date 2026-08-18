import { cn } from "@/lib/utils";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { InspectBaseProfile } from "../profile/BaseProfile";
import { ApplicationHeader } from "../shared/AppHeader";
import { StableSafeAreaView } from "../shared/stables/StableSafeAreaView";

interface InspectProfileProps {
  className?: string;
  id: string;
}

export const InspectProfile = ({ className, id }: InspectProfileProps) => {
  return (
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
                  icon: ChevronLeft,
                  onPress: () => router.back(),
                },
              ]}
            />
          </StableSafeAreaView>
        }
      />
    </View>
  );
};
