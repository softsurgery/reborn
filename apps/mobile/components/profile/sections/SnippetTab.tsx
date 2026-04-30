import { ScrollView, View } from "react-native";
import { ProfileSection, RenderSection } from "./RenderSection";

export const SnippetsTab = ({
  profileSections,
}: {
  profileSections: ProfileSection[];
}) => (
  <ScrollView className="flex-1 bg-background">
    <View className="flex flex-col gap-4 pb-8">
      {profileSections.filter((s) => s.key === "snippets").map(RenderSection)}
    </View>
  </ScrollView>
);
