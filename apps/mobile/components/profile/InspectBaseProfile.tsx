import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useNavigation } from "expo-router";
import { Image, ScrollView, View } from "react-native";
import { showToastable } from "react-native-toastable";
import { api } from "~/api";
import { useFollowSystem } from "~/hooks/content/useFollowSystem";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useIdentifiedUser } from "~/hooks/content/user/useIdentifiedUser";
import { useServerImage } from "~/hooks/content/useServerImage";
import { createUserStore } from "~/hooks/stores/useUserStore";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import {
  ResponseEducationDto,
  ResponseExperienceDto,
  ServerErrorResponse,
  UpdateUserDto,
} from "~/types";
import { Text } from "../ui/text";
import { StablePressable } from "../shared/StablePressable";
import { Icon } from "../ui/icon";
import {
  Mail,
  Pen,
  Plus,
  UserPlus,
  Edit,
  ArrowLeft,
} from "lucide-react-native";
import { Separator } from "../ui/separator";
import { StableScrollView } from "../shared/StableScrollView";
import { cn } from "~/lib/utils";
import { ProfileStat } from "../explore/users/ProfileStat";
import { Button } from "../ui/button";
import { SeeMoreText } from "../shared/SeeMoreText";
import { format } from "date-fns";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { useTranslation } from "react-i18next";

interface ProfileSection<T = unknown> {
  key: string;
  title: string;
  data: T[];
  editable: boolean;
  renderItem: (item: any) => React.ReactNode;
}

interface InspectBaseProfileProps {
  className?: string;
  id: string;
  coverExtra?: React.ReactNode;
  customContent?: React.ReactNode;
  overrideContent?: boolean;
}

const Tab = createMaterialTopTabNavigator();

const AboutTab = ({ user }: { user: any }) => (
  <ScrollView className="flex-1 bg-background">
    <View className="flex flex-col gap-4 pb-8">
      {/* Bio Section */}
      {user?.bio ? (
        <View className="bg-card border border-border overflow-hidden">
          <View className="p-4 bg-primary/10">
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
        <View className="bg-card border border-border p-4">
          <Text className="text-sm text-muted-foreground italic text-center">
            No bio added yet
          </Text>
        </View>
      )}
    </View>
  </ScrollView>
);

const ExperienceTab = ({
  profileSections,
  renderSection,
}: {
  profileSections: ProfileSection[];
  renderSection: (section: ProfileSection) => React.ReactNode;
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
        .map(renderSection)}
    </View>
  </StableScrollView>
);

const SkillsSnippetsTab = ({
  profileSections,
  renderSection,
}: {
  profileSections: ProfileSection[];
  renderSection: (section: ProfileSection) => React.ReactNode;
}) => (
  <StableScrollView className="flex-1 bg-background">
    <View className="flex flex-col gap-4 pb-8">
      {profileSections.filter((s) => s.key === "snippets").map(renderSection)}
    </View>
  </StableScrollView>
);

export const InspectBaseProfile = ({
  className,
  id,
  coverExtra,
  customContent,
  overrideContent = true,
}: InspectBaseProfileProps) => {
  const { t } = useTranslation("common");

  const queryClient = useQueryClient();
  const storeRef = React.useRef(createUserStore());
  const userStore = storeRef?.current?.();

  const { user } = useIdentifiedUser({ id });
  const { currentUser } = useCurrentUser();

  const identity = React.useMemo(() => identifyUser(user), [user]);
  const fallback = React.useMemo(() => identifyUserAvatar(user), [user]);
  const { jsx: profilePicture } = useServerImage({
    id: user?.pictureId,
    fallback,
    wrapperClassName:
      "border border-border bg-background rounded-full shadow-md",
    size: { width: 100, height: 100 },
  });

  const hasSeededRef = React.useRef(false);

  React.useEffect(() => {
    if (!user || hasSeededRef.current) return;

    userStore.set("response", user);
    userStore.set("updateDto", {
      profile: {
        experiences: structuredClone(user.experiences),
      },
    } as UpdateUserDto);

    hasSeededRef.current = true;
  }, [user]);

  const {
    isFollowing,
    refetchIsFollowing,
    followers,
    followings,
    refetchFollowers,
    refetchFollowing,
    followUser,
    isFollowPending,
    unfollowUser,
    isUnfollowPending,
  } = useFollowSystem({
    id: userStore?.response?.id!,
    use: ["is-following", "followers", "followings"],
    follow: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["follow-data-count", userStore?.response?.id],
        });
        refetchFollowers();
        refetchFollowing();
        refetchIsFollowing();
      },
      onError: (err: ServerErrorResponse) => {
        showToastable({ message: err.response?.data.message });
      },
    },
    unfollow: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["follow-data-count", userStore?.response?.id],
        });
        refetchFollowers();
        refetchFollowing();
        refetchIsFollowing();
      },
      onError: (err: ServerErrorResponse) => {
        showToastable({ message: err.response?.data.message });
      },
    },
  });

  React.useEffect(() => {
    userStore?.set("followers", followers);
    userStore?.set("followings", followings);
  }, [followers, followings]);

  const { data: followDataCount } = useQuery({
    queryKey: ["follow-data-count", user?.id],
    queryFn: () => api.follow.findDataCount(user?.id!),
    enabled: !!user?.id,
  });

  React.useEffect(() => {
    if (followDataCount)
      userStore?.set("responseFollowCountsDto", followDataCount);
  }, [followDataCount]);

  React.useEffect(() => {
    return () => {
      userStore?.reset();
      if (!__DEV__) storeRef.current = null as any;
    };
  }, []);

  // ---------------------------------------------------------------
  //  PROFILE SECTIONS CONFIG
  // ---------------------------------------------------------------
  const profileSections: ProfileSection[] = [
    {
      key: "experience",
      title: "Experience",
      data: user?.experiences || [],
      editable: currentUser?.id === user?.id,
      renderItem: (experience: ResponseExperienceDto) => (
        <View className="flex flex-col mb-4 mt-2">
          <Text className="font-semibold">{experience.title}</Text>
          <Text className="text-sm text-muted-foreground font-bold">
            {experience.company}
          </Text>
          <Text className="text-xs text-muted-foreground my-1">
            {format(new Date(experience.startDate!), "MMM yyyy")} —{" "}
            {format(new Date(experience.endDate!), "MMM yyyy")}
          </Text>
          <SeeMoreText textClassname="text-sm" numberOfLines={2}>
            {experience.description || "No description provided."}
          </SeeMoreText>
        </View>
      ),
    },
    {
      key: "education",
      title: "Education",
      data: user?.educations || [],
      editable: currentUser?.id === user?.id,
      renderItem: (education: ResponseEducationDto) => (
        <View className="flex flex-col mb-4 gap-4">
          <Text className="font-semibold">{education.title}</Text>
          <Text className="text-sm text-muted-foreground">
            {education.institution}
          </Text>
          <SeeMoreText textClassname="text-sm" numberOfLines={2}>
            {education.description || "No description provided."}
          </SeeMoreText>
        </View>
      ),
    },
    {
      key: "skills",
      title: "Skills",
      data: [],
      editable: currentUser?.id === user?.id,
      renderItem: (skill) => (
        <Text className="text-sm font-bold">{skill.name}</Text>
      ),
    },
    {
      key: "snippets",
      title: "Snippets",
      // data: user?.profile?.snippets as unknown[],
      data: [],
      editable: currentUser?.id === user?.id,
      renderItem: (snippet) => (
        <View className="flex flex-col">
          <Text className="font-semibold">{snippet.title}</Text>
          <Text className="text-sm text-muted-foreground">
            {snippet.description}
          </Text>
        </View>
      ),
    },
  ];

  // ---------------------------------------------------------------
  //  SECTION RENDERER
  // ---------------------------------------------------------------
  const renderSection = (section: ProfileSection) => (
    <View className="flex flex-col flex-1" key={section.key}>
      <View className={cn("flex flex-1 pt-x bg-card border border-border")}>
        <View className="flex flex-row items-center justify-between bg-primary/10">
          <View className="p-4">
            <Text variant="h4">{section.title}</Text>
          </View>
          {section.editable && (
            <View className="flex flex-row gap-1 items-center p-2">
              <StablePressable
                className="p-2"
                onPress={() => {
                  if (section.key === "experience") {
                    router.push("/main/account/create-experience");
                  } else {
                    router.push("/main/account/create-education");
                  }
                }}
                onPressClassname="bg-primary/25 rounded-full"
              >
                <Icon as={Plus} size={20} className="text-muted-foreground" />
              </StablePressable>
              <StablePressable
                className="p-2"
                onPress={() => {
                  if (section.key === "experience") {
                    router.push("/main/account/update-experiences");
                  } else {
                    router.push("/main/account/update-educations");
                  }
                }}
                onPressClassname="bg-primary/25 rounded-full"
              >
                <Icon as={Pen} size={18} className="text-muted-foreground" />
              </StablePressable>
            </View>
          )}
        </View>
      </View>

      <Separator />

      <View className="p-4">
        {section.data?.length === 0 ? (
          <View key={section.key}>
            <Text className="text-sm text-muted-foreground italic text-center my-4">
              No {section.title} added yet
            </Text>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {Array.isArray(section.data) &&
              section.data.map((item, idx) => (
                <View key={idx}>{section.renderItem(item)}</View>
              ))}
          </View>
        )}
      </View>
    </View>
  );

  // ---------------------------------------------------------------
  //  UI LAYOUT
  // ---------------------------------------------------------------
  return (
    <View className={cn("flex-1 bg-background", className)}>
      {/* Cover */}
      {/* Cover with overlaid header */}
      <View className="relative w-full h-48 bg-card">
        {coverExtra}
        <Image
          source={require("~/assets/images/partial-react-logo.png")}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Header overlaid on cover only when viewing ANOTHER user's profile */}
        {currentUser?.id !== user?.id ? (
          <StableSafeAreaView
            className={cn("absolute left-0 right-0 bg-transparent")}
          >
            <ApplicationHeader
              title={t("screens.profile")}
              titleVariant="large"
              reverse
              shortcuts={[
                {
                  key: "back",
                  icon: ArrowLeft,
                  onPress: () => router.back(),
                },
              ]}
            />
          </StableSafeAreaView>
        ) : null}
      </View>
      {/* Header */}
      <View className="flex-row items-center px-4 -mt-12">
        <View className="z-10">{profilePicture}</View>

        <View className="flex flex-row flex-1 mt-16">
          <View className="flex flex-col flex-1 items-start justify-between px-4 gap-2">
            <View className="flex flex-row items-center gap-2">
              <Text className="text-xl font-semibold text-foreground">
                {identity}
              </Text>
              {id && (
                <Text className="text-sm text-muted-foreground">
                  @{user?.username}
                </Text>
              )}
            </View>
            <ProfileStat
              clientStore={userStore}
              className="flex flex-row"
            />
          </View>
          {currentUser?.id === user?.id && (
            <StablePressable>
              <Icon
                as={Edit}
                size={24}
                onPress={() => router.push("/main/account/update-profile")}
              />
            </StablePressable>
          )}
        </View>
      </View>

      {/* Bio + Sections */}
      <View className="flex flex-col flex-1">
        {/* Follow buttons */}
        {currentUser?.id !== user?.id ? (
          <View className="flex flex-row px-4 my-4 gap-4">
            <Button
              size="sm"
              onPress={() => (isFollowing ? unfollowUser() : followUser())}
              variant={isFollowing ? "outline" : "default"}
              className="flex flex-row flex-1 gap-2"
              disabled={isFollowPending || isUnfollowPending}
            >
              {!isFollowing && <Icon as={UserPlus} size={20} />}
              <Text>{isFollowing ? "Following" : "Follow"}</Text>
            </Button>

            <Button
              size="sm"
              className="flex flex-row flex-1 gap-2"
              variant="outline"
            >
              <Icon as={Mail} size={20} />
              <Text>Send Message</Text>
            </Button>
          </View>
        ) : null}

        <View>{overrideContent && customContent ? customContent : null}</View>
        {/* Profile Content */}
        <View className="flex flex-1" style={{ minHeight: 400 }}>
          <Tab.Navigator
            screenOptions={{
              tabBarScrollEnabled: false,
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: "600",
                textTransform: "none",
              },
              tabBarIndicatorStyle: { backgroundColor: "#9B2C2C" },
              tabBarStyle: { backgroundColor: "transparent" },
            }}
            commonOptions={{
              sceneStyle: {
                flex: 1,
              },
            }}
          >
            <Tab.Screen
              name="about"
              options={{
                tabBarLabel: "About",
              }}
              component={() => <AboutTab user={user} />}
            />

            <Tab.Screen
              name="career"
              options={{
                tabBarLabel: "Career",
              }}
              component={() => (
                <ExperienceTab
                  profileSections={profileSections}
                  renderSection={renderSection}
                />
              )}
            />
            <Tab.Screen
              name="gallery"
              options={{
                tabBarLabel: "Gallery",
              }}
              component={() => (
                <SkillsSnippetsTab
                  profileSections={profileSections}
                  renderSection={renderSection}
                />
              )}
            />
          </Tab.Navigator>
        </View>
        <View>{!overrideContent && customContent ? customContent : null}</View>
      </View>
    </View>
  );
};
