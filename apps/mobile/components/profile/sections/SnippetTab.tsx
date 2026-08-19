import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import { ProfileSection } from "./RenderSection";
import { cn } from "@/lib/utils";
import { RefreshControl } from "react-native";

interface SnippetsTabProps {
  className?: string;
  profileSections: ProfileSection[];
  renderSection: (section: ProfileSection) => React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollRef?: React.RefObject<any>;
}

export const SnippetsTab = ({
  className,
  profileSections,
  renderSection,
  onRefresh,
  refreshing,
  onScroll,
  scrollRef,
}: SnippetsTabProps) => (
  <ScrollView
    ref={scrollRef}
    onScroll={onScroll}
    className={cn("flex-1 bg-background", className)}
    refreshControl={
      <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
    }
  >
    <View className="flex flex-col gap-4 pb-8">
      {profileSections.filter((s) => s.key === "snippets").map(renderSection)}
    </View>
  </ScrollView>
);
