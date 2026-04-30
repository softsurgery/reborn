import { ScrollView, View } from "react-native";
import { SeeMoreText } from "~/components/shared/SeeMoreText";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";

export const AboutTab = ({ user }: { user: any }) => (
  <ScrollView className="flex-1 bg-background">
    <View className="flex flex-col gap-4 pb-8">
      {/* Bio Section */}
      {user?.bio ? (
        <View className="border-b overflow-hidden">
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
