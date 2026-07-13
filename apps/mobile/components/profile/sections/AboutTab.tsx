import { cn } from "@/lib/utils";
import { ResponseUserDto } from "@/types";
import { RefreshControl, ScrollView, View } from "react-native";
import { SeeMoreText } from "~/components/shared/SeeMoreText";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";

interface AboutTabProps {
  className?: string;
  user: ResponseUserDto;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const AboutTab = ({
  className,
  user,
  refreshing,
  onRefresh,
}: AboutTabProps) => (
  <ScrollView
    className={cn(className)}
    refreshControl={
      <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
    }
  >
    <View className="flex flex-col gap-4 pb-8">
      {/* Bio Section */}
      {user?.bio ? (
        <View className="overflow-hidden">
          <View className="p-4 bg-transparent">
            <Text variant="h4">About</Text>
          </View>
          <Separator />
          <View className="p-4">
            <SeeMoreText
              textClassname="text-sm leading-6 text-foreground"
              numberOfLines={4}
            >
              {user.bio}
            </SeeMoreText>
          </View>
        </View>
      ) : (
        <View className="p-4">
          <Text className="text-sm text-muted-foreground italic text-center">
            No bio added yet
          </Text>
        </View>
      )}
    </View>
  </ScrollView>
);
