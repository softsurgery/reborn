import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { View } from "react-native";
import { ApplicationHeader } from "../shared/AppHeader";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { InspectBaseProfile } from "./InspectBaseProfile";
import { cn } from "~/lib/utils";

interface InspectProfileProps {
  className?: string;
  id: string;
  customContent?: React.ReactNode;
  overrideContent?: boolean;
}

export const InspectProfile = ({
  className,
  id,
  customContent,
  overrideContent,
}: InspectProfileProps) => {
  return (
    <View className={cn("flex-1", className)}>
      <InspectBaseProfile
        id={id}
        coverExtra={
          <StableSafeAreaView
            className="absolute top-0 left-0 right-0 z-30 px-2"
            pointerEvents="box-none"
          >
            <ApplicationHeader
              title=""
              reverse
              shortcuts={[
                {
                  key: "settings",
                  icon: ArrowLeft,
                  onPress: () => router.back(),
                },
              ]}
            />
          </StableSafeAreaView>
        }
        customContent={customContent}
        overrideContent={overrideContent}
      />
    </View>
  );
};
