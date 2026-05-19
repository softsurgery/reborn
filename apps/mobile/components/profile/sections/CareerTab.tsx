import { RefreshControl, ScrollView, View } from "react-native";
import { ProfileSection, RenderSection } from "./RenderSection";
import { cn } from "@/lib/utils";

interface CareerTabProps {
  className?: string;
  profileSections: ProfileSection[];
  renderSection: (section: ProfileSection) => React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const CareerTab = ({
  className,
  profileSections,
  renderSection,
  onRefresh,
  refreshing,
}: CareerTabProps) => (
  <ScrollView
    className={cn("flex-1 bg-background", className)}
    refreshControl={
      <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
    }
  >
    <View className="flex flex-col gap-4 pb-8">
      {profileSections
        .filter(
          (s) =>
            s.key === "experience" ||
            s.key === "education" ||
            s.key === "skills",
        )
        .map(renderSection)}
    </View>
  </ScrollView>
);
