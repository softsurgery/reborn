import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { View } from "react-native";
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
import { cn } from "~/lib/utils";
import { useUserStore } from "~/hooks/stores/useUserStore";
import { SocialStat } from "./social/SocialStat";
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
import Animated, { FadeInUp } from "react-native-reanimated";
import { useLoader } from "@/contexts/LoaderContext";
import { JobsTab } from "./sections/JobsTab";

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
    scrollRef,
    scrollToTop,
  } = useScrollableElement({
    duration: 400,
    deltaThreshold: 100,
    ignoreTopInset: true,
  });

  const { t } = useTranslation("menu");

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
        toast.success(t("menu.toasts.emailSent"), {
          description: t("menu.toasts.emailSentDescription"),
        });
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(
          error.response?.data?.message || t("menu.toasts.emailError"),
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
          queryKey: ["follow-data-count", user?.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["social-data", user?.id],
        });
        refetchFollowers();
        refetchFollowing();
        refetchIsFollowing();
        refetchSocialStat();
      },
      onError: (err: ServerErrorResponse) => {
        toast.error(err.response?.data.message || "Failed to follow user");
      },
    },
    unfollow: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["follow-data-count", user?.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["social-data", user?.id],
        });
        refetchFollowers();
        refetchFollowing();
        refetchIsFollowing();
        refetchSocialStat();
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
        <View className="pb-4" onLayout={onLayout}>
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
            <Animated.View
              entering={FadeInUp.duration(400).delay(150)}
              className="flex flex-row items-start justify-between mt-3 w-full gap-3"
            >
              <View className="flex-1 min-w-0 pr-2">
                <Text
                  className="text-lg font-bold text-foreground"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {identity}
                </Text>
                {id && (
                  <View className="flex-col items-start justify-between gap-2">
                    <View className="flex flex-row items-center gap-2">
                      <Text
                        className="text-sm text-muted-foreground"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        @{user?.username}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <ProfileStat
                className="-mt-8 mb-4 shrink-0"
                user={user}
                currentUser={currentUser}
                sendVerifyEmail={sendVerifyEmail}
                isSendVerifyEmailPending={isSendVerifyEmailPending}
                isFollowing={isFollowing}
                onFollowPress={() =>
                  isFollowing ? unfollowUser() : followUser()
                }
              />
            </Animated.View>
          </View>

          <Animated.View entering={FadeInUp.duration(400).delay(220)}>
            <SocialStat className="w-[70vw] mx-auto" userId={user?.id} />
          </Animated.View>

          {/* Bio + Sections */}
          <View className="flex flex-col">
            <View>
              {overrideContent && customContent ? customContent : null}
            </View>
          </View>
        </View>
      </Animated.View>
      <Animated.View
        entering={FadeInUp.duration(450).delay(280)}
        className={cn("flex-1")}
        style={contentAnimatedStyle}
      >
        {/* Profile Content */}
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: false,
            tabBarActiveTintColor: palette.foreground,
            tabBarInactiveTintColor: palette.mutedForeground,
            tabBarLabelStyle: {
              fontSize: 13,
              fontWeight: "600",
              textTransform: "none",
            },
            tabBarIndicatorStyle: {
              backgroundColor: hslToHex(palette.primary),
              height: 2,
              borderRadius: 2,
            },
            tabBarStyle: {
              backgroundColor: "transparent",
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: palette.border,
            },
          }}
          commonOptions={{
            sceneStyle: {
              flex: 1,
            },
          }}
          screenListeners={{
            state: () => scrollToTop(),
            tabPress: () => scrollToTop(),
          }}
        >
          <Tab.Screen
            name="about"
            options={{
              tabBarLabel: t("menu.tabs.about.title"),
            }}
          >
            {() => (
              <AboutTab
                user={user}
                onRefresh={onRefresh}
                refreshing={refreshing}
                onScroll={handleScroll}
                scrollRef={scrollRef}
              />
            )}
          </Tab.Screen>

          {currentUser?.id !== user?.id && (
            <Tab.Screen
              name="jobs"
              options={{
                tabBarLabel: "Jobs",
              }}
            >
              {() => (
                <JobsTab
                  user={user}
                  onRefresh={onRefresh}
                  refreshing={refreshing}
                  onScroll={handleScroll}
                  scrollRef={scrollRef}
                />
              )}
            </Tab.Screen>
          )}

          <Tab.Screen
            name="career"
            options={{
              tabBarLabel: t("menu.tabs.career.title"),
            }}
          >
            {() => (
              <CareerTab
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderSection={RenderSection}
                profileSections={profileSections}
                onScroll={handleScroll}
                scrollRef={scrollRef}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="gallery"
            options={{
              tabBarLabel: t("menu.tabs.gallery.title"),
            }}
          >
            {() => (
              <SnippetsTab
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderSection={RenderSection}
                profileSections={profileSections}
                onScroll={handleScroll}
                scrollRef={scrollRef}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </Animated.View>
    </View>
  );
};
