import { UserEntry } from "@/components/profile/social/UserEntry";
import { Loader } from "@/components/shared/lotties/Loader";
import { Text } from "@/components/ui/text";
import { useFollowSystem } from "@/hooks/content/useFollowSystem";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";

interface FollowersTabProps {
  profileId: string;
}

export const FollowersTab = ({ profileId }: FollowersTabProps) => {
  const { t } = useTranslation("menu");
  const { followers, isFollowersPending } = useFollowSystem({
    id: profileId,
    use: ["followers"],
  });

  if (isFollowersPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader isPending size="small" />
      </View>
    );
  }

  if (!followers?.length) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text variant="muted" className="text-center">
          {t("menu.social.noFollowers")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 px-2">
      <View className="pb-6">
        {followers.map((f) => (
          <UserEntry
            key={f.id}
            user={f.follower}
            profileId={profileId}
            className="mt-4"
          />
        ))}
      </View>
    </ScrollView>
  );
};
