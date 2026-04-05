import { StableScrollView } from "~/components/shared/StableScrollView";
import { ProfileSection } from "./profile-section";
import { View } from "react-native";
import { RenderSection } from "./RenderSection";

export const ExperienceTab = ({
  profileSections,
}: {
  profileSections: ProfileSection[];
}) => (
  <StableScrollView className="flex-1 bg-background">
    <View className="flex flex-col gap-4 pb-8">
      {profileSections
        .filter(
          (s) =>
            s.key === "experience" ||
            s.key === "education" ||
            s.key === "skills",
        )
        .map(RenderSection)}
    </View>
  </StableScrollView>
);
