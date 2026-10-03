import { UserEntry } from "@/components/profile/social/UserEntry";
import { Loader } from "@reborn/mobile-components";
import { Text } from "@reborn/mobile-ui";
import { useFollowSystem } from "@/hooks/content/useFollowSystem";
import { ScrollView, View } from "react-native";
import { useTranslation } from "@reborn/i18n";

interface FollowingTabProps {
  profileId: string;
}

export const FollowingTab = ({ profileId }: FollowingTabProps) => {
  const { t } = useTranslation("menu");
  const { followings, isFollowingPending } = useFollowSystem({
    id: profileId,
    use: ["followings"],
  });

  if (isFollowingPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader isPending size="small" />
      </View>
    );
  }

  if (!followings?.length) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text variant="muted" className="text-center">
          {t("menu.social.noFollowing")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 px-2">
      <View className="pb-6">
        {followings.map((f) => (
          <UserEntry key={f.id} user={f.following} className="mt-4" />
        ))}
      </View>
    </ScrollView>
  );
};
