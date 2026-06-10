import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Image, Pressable, View } from "react-native";
import type { ImageSourcePropType } from "react-native";
import { api } from "~/api";
import { useFollowSystem } from "~/hooks/content/useFollowSystem";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useIdentifiedUser } from "~/hooks/content/user/useIdentifiedUser";
import { useServerImage } from "~/hooks/content/useServerImage";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import {
  ResponseEducationDto,
  ResponseExperienceDto,
  ResponseRefParamDto,
  ServerErrorResponse,
  UpdateUserCoverDto,
  UpdateUserDto,
} from "~/types";
import { Text } from "../ui/text";
import { Icon } from "../ui/icon";
import { Mail, UserPlus, Edit, Pencil } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { useUserStore } from "~/hooks/stores/useUserStore";
import { SocialStat } from "./social/SocialStat";
import { Button } from "../ui/button";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { useExperiences } from "~/hooks/content/user/useExperiences";
import { useEducations } from "~/hooks/content/user/useEducations";
import { AboutTab } from "./sections/AboutTab";
import { SnippetsTab } from "./sections/SnippetTab";
import { PhotoPreview } from "../shared/PhotoPreview";
import { useServerImages } from "@/hooks/content/useServerImages";
import * as ImagePicker from "expo-image-picker";
import { useUploadMutation } from "@/hooks/content/useUploadMutation";
import { Upload } from "@/types/upload";
import { toast } from "sonner-native";
import { Loader } from "../shared/Loader";
import { BaseProfileSkeleton } from "./BaseProfileSkeleton";
import { ProfileSection, RenderSection } from "./sections/RenderSection";
import { hslToHex } from "@/lib/theme";
import { useColorPalette } from "@/hooks/useColorPalette";
import { CareerTab } from "./sections/CareerTab";
import { ExperienceInstance } from "./experience/ExperienceInstance";
import { EducationInstance } from "./education/EducationInstance";
import { Skeleton } from "../ui/skeleton";
import { ProfileStat } from "./ProfileStat";

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
  const { t } = useTranslation("common");

  const queryClient = useQueryClient();
  const userStore = useUserStore();
  const [draftCoverUri, setDraftCoverUri] = React.useState<string | null>(null);

  const { user, refetchUser, isUserPending } = useIdentifiedUser({
    id,
  });
  const { currentUser, refetchCurrentUser } = useCurrentUser();

  const identity = React.useMemo(() => identifyUser(user), [user]);
  const fallback = React.useMemo(() => identifyUserAvatar(user), [user]);

  const { mutate: sendVerifyEmail, isPending: isSendVerifyEmailPending } =
    useMutation({
      mutationFn: () => api.auth.sendVerifyEmail(user?.email),
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

  //profile picture side-effect
  const {
    uploads: profileUploads,
    jsxArray: profilePictures,
    isPending: isProfilePicturePending,
  } = useServerImages({
    ids: [user?.pictureId],
    fallbacks: [fallback],
    className: "rounded-full",
    wrapperClassName: "border border-border bg-background rounded-full",
    size: { width: 100, height: 100 },
    enabled: !!user && !!user.pictureId,
  });
  const profilePictureSource = profileUploads?.[0];

  const { uploads: coverUploads, isPending: isCoverPending } = useServerImages({
    ids: [user?.coverId],
    fallbacks: [""],
    wrapperClassName: "",
    size: { width: 100, height: 100 },
    enabled: !!user && !!user.coverId,
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

  const { uploadFiles: uploadCover, isUploadPending: isCoverUploadPending } =
    useUploadMutation({
      onSuccess: (response: Upload[]) => {
        const coverId = response?.[0]?.id;
        if (coverId) {
          updateUserCover({ coverId: coverId });
        }
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(
          error.response?.data?.message || "Failed to upload image",
          {},
        );
      },
    });

  const { mutate: updateUserCover, isPending: isUpdateCoverPending } =
    useMutation({
      mutationFn: (coverDto: UpdateUserCoverDto) =>
        api.client.updateCover(coverDto),
      onSuccess: () => {
        toast.success("Cover updated successfully", {
          description: "Your cover has been successfully updated.",
        });
        userStore.reset();
        queryClient.invalidateQueries({ queryKey: ["user", currentUser?.id] });
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        queryClient.invalidateQueries({
          queryKey: ["server-image", currentUser?.coverId],
        });
        refetchCurrentUser();
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(
          error.response?.data?.message || "Failed to update cover",
          {},
        );
      },
    });

  const handlePickCover = async () => {
    if (currentUser?.id !== id) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    // INSTANT UI PREVIEW
    setDraftCoverUri(asset.uri);

    const fileLike = {
      uri: asset.uri,
      name: asset.uri.split("/").pop() || "cover.jpg",
      type: asset.mimeType || "image/jpeg",
    } as unknown as File;

    // AUTO UPLOAD
    uploadCover({
      files: [fileLike],
    });
  };

  const coverSource = coverUploads?.[0];

  const coverImageSource = React.useMemo<
    ImageSourcePropType | undefined
  >(() => {
    switch (typeof coverSource) {
      case "string":
        return { uri: coverSource };
      case "number":
        return coverSource;
      case "object": {
        if (!coverSource || !("uri" in coverSource)) return undefined;
        const uri = String(coverSource.uri ?? "");
        return uri ? { uri } : undefined;
      }
      default:
        return require("~/assets/images/partial-react-logo.png");
    }
  }, [coverSource]);

  const coverPreviewSource = React.useMemo<ImageSourcePropType | undefined>(
    () => (draftCoverUri ? { uri: draftCoverUri } : coverImageSource),
    [draftCoverUri, coverImageSource],
  );

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

  const profileSections: ProfileSection[] = [
    {
      key: "experience",
      title: "Experience",
      data: userStore?.experiences || [],
      editable: currentUser?.id === user?.id,
      renderItem: (experience: ResponseExperienceDto) => (
        <ExperienceInstance experience={experience} />
      ),
    },
    {
      key: "education",
      title: "Education",
      data: userStore?.educations || [],
      editable: currentUser?.id === user?.id,
      renderItem: (education: ResponseEducationDto) => (
        <EducationInstance education={education} />
      ),
    },
    {
      key: "skills",
      title: "Skills",
      data: [],
      editable: currentUser?.id === user?.id,
      renderItem: (skill: ResponseRefParamDto) => (
        <Text className="text-sm font-bold">{skill.label}</Text>
      ),
    },
    {
      key: "snippets",
      title: "Snippets",
      // data: user?.profile?.snippets as unknown[],
      data: [],
      editable: currentUser?.id === user?.id,
      renderItem: (snippet: any) => (
        <View className="flex flex-col">
          <Text className="font-semibold">{snippet.title}</Text>
          <Text className="text-sm text-muted-foreground">
            {snippet.description}
          </Text>
        </View>
      ),
    },
  ];

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
    isEducationsPending ||
    isCoverPending;

  if (refreshing || !user) {
    return <BaseProfileSkeleton className={className} />;
  }

  return (
    <View className={cn("bg-background flex-1", className)}>
      <View>
        {coverExtra}
        <PhotoPreview
          className="active:opacity-70 relative w-full h-48 overflow-hidden bg-muted items-center justify-center"
          source={coverPreviewSource}
          onPress={handlePickCover}
          footer={() => {
            if (currentUser?.id !== id) return null;

            return (
              <Pressable
                className="flex flex-row gap-2 items-center px-4 py-2 m-4 mx-auto border border-border rounded-full active:bg-muted"
                onPress={handlePickCover}
              >
                <Icon as={Pencil} color="white" />
                <Text className="text-white">Change Cover</Text>
              </Pressable>
            );
          }}
        >
          <Image
            source={coverImageSource}
            className="w-full h-full opacity-70"
            resizeMode="cover"
          />
        </PhotoPreview>
        {(isCoverUploadPending || isUpdateCoverPending) && (
          <View className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
            <Loader isPending={true} size="large" />
          </View>
        )}
        <View className="flex-col items-start px-4 -mt-12 z-10">
          <View className="flex-row w-full items-end justify-between">
            {isProfilePicturePending ? (
              <Skeleton className="h-[100px] w-[100px] rounded-full" />
            ) : (
              <PhotoPreview source={profilePictureSource}>
                {profilePictures[0]}
              </PhotoPreview>
            )}
            {currentUser?.id === id && <ProfileStat />}
          </View>

          {/* Identity */}
          <View className="mt-3">
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
                {currentUser?.id === id &&
                  user?.email &&
                  !user.emailVerified && (
                    <Pressable
                      onPress={() => sendVerifyEmail()}
                      disabled={isSendVerifyEmailPending}
                      className="flex-row items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 active:opacity-80 bg-yellow-700"
                    >
                      <Icon as={Mail} size={16} color={"white"} />
                      <Text className="text-md font-semibold text-white">
                        Verify email
                      </Text>
                    </Pressable>
                  )}
              </View>
            )}
          </View>
        </View>
      </View>

      <SocialStat className="flex flex-row w-[70vw] mx-auto my-4" />

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
    </View>
  );
};
