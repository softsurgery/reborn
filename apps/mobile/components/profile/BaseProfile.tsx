import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pressable, View } from "react-native";
import { api } from "~/api";
import { useFollowSystem } from "~/hooks/content/useFollowSystem";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useIdentifiedUser } from "~/hooks/content/user/useIdentifiedUser";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import {
  ResponseEducationDto,
  ResponseExperienceDto,
  ResponseRefParamDto,
  ServerErrorResponse,
  UpdateUserDto,
} from "~/types";
import { Text } from "../ui/text";
import { Icon } from "../ui/icon";
import { Mail, UserPlus } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { useUserStore } from "~/hooks/stores/useUserStore";
import { SocialStat } from "./social/SocialStat";
import { Button } from "../ui/button";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { useTranslation } from "react-i18next";
import { useExperiences } from "~/hooks/content/user/useExperiences";
import { useEducations } from "~/hooks/content/user/useEducations";
import { AboutTab } from "./sections/AboutTab";
import { SnippetsTab } from "./sections/SnippetTab";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileCover } from "./ProfileCover";
import { toast } from "sonner-native";
import { BaseProfileSkeleton } from "./BaseProfileSkeleton";
import { ProfileSection, RenderSection } from "./sections/RenderSection";
import { hslToHex } from "@/lib/theme";
import { useColorPalette } from "@/hooks/useColorPalette";
import { CareerTab } from "./sections/CareerTab";
import { ExperienceInstance } from "./forms/experience/ExperienceInstance";
import { EducationInstance } from "./forms/education/EducationInstance";
import { ProfileStat } from "./ProfileStat";
import { useScrollableElement } from "@/hooks/useScrollableElement";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLoader } from "@/contexts/LoaderContext";

interface InspectBaseProfileProps {
  className?: string;
  id: string;
  coverExtra?: React.ReactNode;
  customContent?: React.ReactNode;
  overrideContent?: boolean;
}

const Tab = createMaterialTopTabNavigator();

export const InspectBaseProfile = ({
  className,
  id,
  coverExtra,
  customContent,
  overrideContent = true,
}: InspectBaseProfileProps) => {
  const { palette } = useColorPalette();
  const {
    animatedHeaderStyle,
    contentAnimatedStyle,
    handleScroll,
    onLayout,
    showHeader,
  } = useScrollableElement({
    deltaThreshold: 0,
    duration: 400,
    checkScrollable: true,
  });
  const insets = useSafeAreaInsets();
  const animatedTabsStyle = useAnimatedStyle(() => {
    return {
      paddingTop: withTiming(showHeader.value ? 0 : insets.top, {
        duration: 400,
      }),
    };
  });
  const { t } = useTranslation("common");

  const queryClient = useQueryClient();
  const userStore = useUserStore();
  const { setLoading } = useLoader();

  const { user, refetchUser, isUserPending } = useIdentifiedUser({
    id,
  });
  const { currentUser, refetchCurrentUser } = useCurrentUser();

  const identity = React.useMemo(() => identifyUser(user), [user]);
  const fallback = React.useMemo(() => identifyUserAvatar(user), [user]);

  const { mutate: sendVerifyEmail, isPending: isSendVerifyEmailPending } =
    useMutation({
      mutationFn: () => api.auth.sendVerifyEmail(user?.email),
      onMutate: () => setLoading(true),
      onSettled: () => setLoading(false),
      onSuccess: () => {
        toast.success("Email sent successfully", {
          description: "Check your email for verification link.",
        });
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(
          error.response?.data?.message || "Failed to update cover",
          {},
        );
      },
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
    unfollowUser,
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
        toast.error(err.response?.data.message || "Failed to follow user");
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
        toast.error(err.response?.data.message || "Failed to unfollow user");
      },
    },
  });

  React.useEffect(() => {
    userStore?.set("followers", followers);
    userStore?.set("followings", followings);
  }, [followers, followings]);

  const {
    data: socialStat,
    isPending: isSocialStatPending,
    refetch: refetchSocialStat,
  } = useQuery({
    queryKey: ["social-data", user?.id],
    queryFn: () => api.follow.findDataCount(user?.id!),
    enabled: !!user?.id,
  });

  React.useEffect(() => {
    if (socialStat) userStore?.set("responseFollowCountsDto", socialStat);
  }, [socialStat]);

  // experience side-effects
  const { experiences, isExperiencesPending, refetchExperiences } =
    useExperiences({ id, enabled: !!user });
  React.useEffect(() => {
    if (experiences) userStore?.set("experiences", experiences);
  }, [experiences]);

  // education side-effects
  const { educations, isEducationsPending, refetchEducations } = useEducations({
    id,
    enabled: !!user,
  });
  React.useEffect(() => {
    if (educations) userStore?.set("educations", educations);
  }, [educations]);

  React.useEffect(() => {
    return () => {
      userStore?.reset();
    };
  }, []);

  const profileSections: ProfileSection[] = React.useMemo(
    () => [
      {
        key: "experience",
        title: t("menu.tabs.career.experience.title"),
        data: experiences as unknown[],
        editable: currentUser?.id === user?.id,
        renderItem: (experience: ResponseExperienceDto) => (
          <ExperienceInstance experience={experience} />
        ),
      },
      {
        key: "education",
        title: t("menu.tabs.career.education.title"),
        data: educations as unknown[],
        editable: currentUser?.id === user?.id,
        renderItem: (education: ResponseEducationDto) => (
          <EducationInstance education={education} />
        ),
      },
    ],
    [experiences, educations, currentUser?.id, user?.id, t],
  );

  const onRefresh = async () => {
    await Promise.allSettled([
      refetchUser(),
      refetchSocialStat(),
      refetchCurrentUser(),
      refetchExperiences(),
      refetchEducations(),
    ]);
  };

  const refreshing =
    isUserPending ||
    isSocialStatPending ||
    isExperiencesPending ||
    isEducationsPending;

  if (refreshing || !user) {
    return <BaseProfileSkeleton className={className} />;
  }

  return (
    <View className={cn("bg-background flex-1", className)}>
      <Animated.View style={animatedHeaderStyle}>
        <View onLayout={onLayout}>
          <ProfileCover
            user={user}
            currentUser={currentUser}
            onRefresh={onRefresh}
            coverExtra={coverExtra}
          />
          <View className="flex-col items-start px-4 z-10 -mt-12">
            <View className="flex-row w-full justify-between">
              <ProfileAvatar
                user={user}
                currentUser={currentUser}
                onRefresh={onRefresh}
              />
            </View>

            {/* Identity */}
            <View className="flex flex-row items-start justify-between mt-3 w-full">
              <View>
                <Text className="text-2xl font-bold text-foreground">
                  {identity}
                </Text>
                {id && (
                  <View className="flex-col items-start justify-between gap-2">
                    <View className="flex flex-row items-center gap-2">
                      <Text className="text-sm text-muted-foreground">
                        @{user?.username}
                      </Text>
                      {!!user?.email &&
                        !user?.emailVerified &&
                        currentUser?.id === id && (
                          <Text className="text-xs text-yellow-600 font-bold">
                            (Unverified Email)
                          </Text>
                        )}
                    </View>
                  </View>
                )}
              </View>
              {currentUser?.id === id && (
                <ProfileStat
                  className="-mt-8 mb-4"
                  user={user}
                  currentUser={currentUser}
                  sendVerifyEmail={sendVerifyEmail}
                  isSendVerifyEmailPending={isSendVerifyEmailPending}
                />
              )}
            </View>
          </View>
          <SocialStat className="w-[70vw] mx-auto" />
        </View>
      </Animated.View>
      <Animated.View
        className={cn("flex-1", !user?.emailVerified ? "mt-2" : "")}
        style={animatedTabsStyle}
      >
        {/* Bio + Sections */}
        <View className="flex flex-col">
          {/* Follow buttons */}
          {currentUser?.id !== user?.id ? (
            <View className="flex flex-row px-4 my-4 gap-4">
              <Button
                size="sm"
                onPress={() => (isFollowing ? unfollowUser() : followUser())}
                variant={isFollowing ? "outline" : "default"}
                className="flex flex-row flex-1 gap-2"
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
        </View>

        {/* Profile Content */}
        <View className="flex-1">
          <Tab.Navigator
            screenOptions={{
              tabBarScrollEnabled: false,
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: "600",
                textTransform: "none",
              },
              tabBarIndicatorStyle: {
                backgroundColor: hslToHex(palette.primary),
              },
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
            >
              {() => (
                <AboutTab
                  user={user}
                  onRefresh={onRefresh}
                  refreshing={refreshing}
                  onScroll={handleScroll}
                />
              )}
            </Tab.Screen>

            <Tab.Screen
              name="career"
              options={{
                tabBarLabel: "Career",
              }}
            >
              {() => (
                <CareerTab
                  onRefresh={onRefresh}
                  refreshing={refreshing}
                  renderSection={RenderSection}
                  profileSections={profileSections}
                />
              )}
            </Tab.Screen>
            <Tab.Screen
              name="gallery"
              options={{
                tabBarLabel: "Gallery",
              }}
            >
              {() => (
                <SnippetsTab
                  onRefresh={onRefresh}
                  refreshing={refreshing}
                  renderSection={RenderSection}
                  profileSections={profileSections}
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
      </Animated.View>
    </View>
  );
};
