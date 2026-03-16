import { View } from "react-native";
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
        customContent={customContent}
        overrideContent={overrideContent}
      />
    </View>
  );
};
