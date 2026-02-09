import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useNavigation } from "expo-router";
import { Image, View } from "react-native";
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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StablePressable } from "../shared/StablePressable";
import { Icon } from "../ui/icon";
import { Mail, Pen, Plus, UserPlus } from "lucide-react-native";
import { Separator } from "../ui/separator";
import { StableScrollView } from "../shared/StableScrollView";
import { cn } from "~/lib/utils";
import { ProfileStat } from "../explore/users/ProfileStat";
import { Button } from "../ui/button";
import { SeeMoreText } from "../shared/SeeMoreText";
import { format } from "date-fns";

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

export const InspectBaseProfile = ({
  className,
  id,
  coverExtra,
  customContent,
  overrideContent = true,
}: InspectBaseProfileProps) => {
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
      data: user?.experiences as unknown[],
      editable: currentUser?.id === user?.id,
      renderItem: (experience: ResponseExperienceDto) => (
        <View className="flex flex-col mb-4">
          <Text className="font-semibold">{experience.title}</Text>
          <Text className="text-sm text-muted-foreground font-bold">
            {experience.company}
          </Text>
          <Text className="text-xs text-muted-foreground my-1">
            {format(new Date(experience.startDate), "MMM yyyy")} —{" "}
            {format(new Date(experience.endDate), "MMM yyyy")}
          </Text>
          <SeeMoreText textClassname="text-sm" numberOfLines={2}>
            {experience.description}
          </SeeMoreText>
        </View>
      ),
    },
    {
      key: "education",
      title: "Education",
      data: user?.educations || [],
      editable: currentUser?.id === user?.id,
      renderItem: (edu: ResponseEducationDto) => (
        <View className="flex flex-col mb-4">
          <Text className="font-semibold">{edu.title}</Text>
          <Text className="text-sm text-muted-foreground">
            {edu.institution}
          </Text>
          <Text className="text-xs text-muted-foreground my-1">
            {format(new Date(edu.startDate), "MMM yyyy")} —{" "}
            {edu.endDate
              ? format(new Date(edu.endDate), "MMM yyyy")
              : "Present"}
          </Text>
          <SeeMoreText textClassname="text-sm" numberOfLines={2}>
            {edu.description}
          </SeeMoreText>
        </View>
      ),
    },
    // {
    //   key: "skills",
    //   title: "Skills",
    //   data: user?.skills || [],
    //   editable: currentUser?.id === user?.id,
    //   renderItem: (skill: Skill) => (
    //     <Text className="text-sm font-bold">{skill.name}</Text>
    //   ),
    // },
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
    <Card key={section.key} className="m-0">
      <CardHeader className="flex flex-row items-center justify-between -my-2">
        <CardTitle>
          <Text variant="h4">{section.title}</Text>
        </CardTitle>

        {section.editable && (
          <View className="flex flex-row gap-1 items-center -mx-2">
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
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col gap-7 mt-4">
        {Array.isArray(section.data) && section.data?.length > 0 ? (
          section.data.map((item, idx) => (
            <View key={idx}>{section.renderItem(item)}</View>
          ))
        ) : (
          <Text className="text-sm text-muted-foreground italic">
            No {section.title.toLowerCase()} yet.
          </Text>
        )}
      </CardContent>
    </Card>
  );

  // ---------------------------------------------------------------
  //  UI LAYOUT
  // ---------------------------------------------------------------
  return (
    <StableScrollView className={cn("flex-1 bg-background", className)}>
      {/* Cover */}
      <View className="relative w-full h-48 bg-card">
        {coverExtra}
        <Image
          source={require("~/assets/images/partial-react-logo.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Header */}
      <View className="flex-row items-center px-5 -mt-12">
        <View className="z-10">{profilePicture}</View>

        <View className="flex-1 mt-16">
          <View className="flex-col items-start justify-between mx-2">
            <View>
              <Text className="text-xl font-semibold text-foreground">
                {identity}
              </Text>
              {id && (
                <Text className="text-sm text-muted-foreground">
                  @{user?.username}
                </Text>
              )}
            </View>

            {userStore ? (
              <ProfileStat
                clientStore={userStore}
                className="flex flex-row gap-4 mt-4"
              />
            ) : null}
          </View>
        </View>
      </View>

      {/* Bio + Sections */}
      <View className="flex flex-col gap-4 flex-1 px-4 mt-6 pb-10">
        <Text className="italic text-xs">{user?.bio}</Text>

        {/* Follow buttons */}
        <View className="flex flex-row w-full justify-between gap-2">
          {currentUser?.id !== user?.id ? (
            <React.Fragment>
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
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button
                size="sm"
                onPress={() => router.push("/main/account/update-profile")}
                className="flex flex-row flex-1 gap-2"
              >
                <Text className="bold">Update Your Profile</Text>
              </Button>
            </React.Fragment>
          )}
        </View>

        {/* Render all abstracted profile sections */}
        {overrideContent && customContent ? (
          customContent
        ) : (
          <View className="flex flex-col gap-4">
            {profileSections.map(renderSection)}
          </View>
        )}
        {!overrideContent && customContent ? customContent : null}
      </View>
    </StableScrollView>
  );
};
