import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Image, Pressable, ScrollView, View } from "react-native";
import type { ImageSourcePropType } from "react-native";
import { type ActionSheetRef } from "react-native-actions-sheet";
import { api } from "~/api";
import { useFollowSystem } from "~/hooks/content/useFollowSystem";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { useIdentifiedUser } from "~/hooks/content/user/useIdentifiedUser";
import { useServerImage } from "~/hooks/content/useServerImage";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import {
  ResponseEducationDto,
  ResponseExperienceDto,
  ServerErrorResponse,
  UpdateUserCoverDto,
  UpdateUserDto,
} from "~/types";
import { Text } from "../ui/text";
import { StablePressable } from "../shared/StablePressable";
import { Icon } from "../ui/icon";
import { Mail, UserPlus, Edit, ArrowLeft } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { useUserStore } from "~/hooks/stores/useUserStore";
import { ProfileStat } from "../explore/users/ProfileStat";
import { Button } from "../ui/button";
import { SeeMoreText } from "../shared/SeeMoreText";
import { format } from "date-fns";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { useTranslation } from "react-i18next";
import { useExperiences } from "~/hooks/content/user/useExperiences";
import { useEducations } from "~/hooks/content/user/useEducations";
import { ProfileSection } from "./sections/profile-section";
import { AboutTab } from "./sections/AboutTab";
import { ExperienceTab } from "./sections/ExperienceTab";
import { SnippetsTab } from "./sections/SnippetTab";
import { ProfilePhotoPreview } from "../shared/ProfilePhotoPreview";
import { useServerImages } from "@/hooks/content/useServerImages";
import { Skeleton } from "../ui/skeleton";
import * as ImagePicker from "expo-image-picker";
import { useUploadMutation } from "@/hooks/content/useUploadMutation";
import { Upload } from "@/types/upload";
import { toast } from "sonner-native";
import { Loader } from "../shared/Loader";
import { BaseProfileSkeleton } from "./BaseProfileSkeleton";
import { ProfileCoverActionSheet } from "./ProfileCoverActionSheet";
import { RefreshControl } from "react-native-gesture-handler";

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
  const { t } = useTranslation("common");

  const queryClient = useQueryClient();
  const coverSheetRef = React.useRef<ActionSheetRef>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const userStore = useUserStore();
  const [draftCoverUri, setDraftCoverUri] = React.useState<string | null>(null);
  const [draftCoverFile, setDraftCoverFile] = React.useState<File | null>(null);

  const { user, refetchUser } = useIdentifiedUser({
    id,
  });
  const { currentUser, refetchCurrentUser } = useCurrentUser();
  const isOwner = currentUser?.id === id;

  const identity = React.useMemo(() => identifyUser(user), [user]);
  const fallback = React.useMemo(() => identifyUserAvatar(user), [user]);

  const { jsx: profilePicture, upload: uploadProfilePicture } = useServerImage({
    id: user?.pictureId,
    fallback,
    wrapperClassName:
      "border border-border bg-background rounded-full shadow-md",
    size: { width: 100, height: 100 },
  });

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
        setDraftCoverUri(null);
        setDraftCoverFile(null);
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
    if (currentUser?.id !== id) return; // Prevent others from updating

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const fileLike = {
        uri: asset.uri,
        name: asset.uri.split("/").pop() || "cover.jpg",
        type: asset.type || "image/jpeg",
      } as unknown as File;

      setDraftCoverUri(asset.uri);
      setDraftCoverFile(fileLike);
    }
  };

  const handleCoverPress = () => {
    setDraftCoverUri(null);
    setDraftCoverFile(null);
    coverSheetRef.current?.show();
  };

  const handleCloseCoverSheet = () => {
    coverSheetRef.current?.hide();
    setDraftCoverUri(null);
    setDraftCoverFile(null);
  };

  const handleConfirmCover = () => {
    if (!(currentUser?.id === id)) {
      toast.error("Only the profile owner can update this cover");
      return;
    }

    if (!draftCoverFile) {
      toast.error("Please choose an image first");
      return;
    }

    uploadCover({ files: [draftCoverFile] });
    coverSheetRef.current?.hide();
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
        return undefined;
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

  const { data: followDataCount } = useQuery({
    queryKey: ["follow-data-count", user?.id],
    queryFn: () => api.follow.findDataCount(user?.id!),
    enabled: !!user?.id,
  });

  React.useEffect(() => {
    if (followDataCount)
      userStore?.set("responseFollowCountsDto", followDataCount);
  }, [followDataCount]);

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
      data: userStore?.educations || [],
      editable: currentUser?.id === user?.id,
      renderItem: (education: ResponseEducationDto) => (
        <View className="flex flex-col mb-4 gap-2">
          <Text className="font-semibold">{education.title}</Text>
          <Text className="text-xs text-muted-foreground my-1">
            {format(new Date(education.startDate!), "MMM yyyy")} —{" "}
            {format(new Date(education.endDate!), "MMM yyyy")}
          </Text>
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

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      refetchUser(),
      refetchCurrentUser(),
      refetchExperiences(),
      refetchEducations(),
    ]);
    setIsRefreshing(false);
  };

  const isInitialLoading =
    isCoverPending ||
    isUpdateCoverPending ||
    isExperiencesPending ||
    isEducationsPending ||
    isFollowPending;

  // ---------------------------------------------------------------
  //  UI LAYOUT
  // ---------------------------------------------------------------
  return (
    <ScrollView
      className={cn("flex-1 bg-background h-full", className)}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {isInitialLoading ? (
        <BaseProfileSkeleton className={className} />
      ) : (
        <React.Fragment>
          {/* Cover */}
          {!isCoverPending ? (
            <Pressable
              className="active:opacity-70 relative w-full h-48 overflow-hidden"
              onPress={handleCoverPress}
            >
              <Image
                source={
                  coverImageSource
                    ? coverImageSource
                    : require("@/assets/images/partial-react-logo.png")
                }
                className="w-full h-full opacity-70"
                resizeMode="cover"
              />
            </Pressable>
          ) : (
            <Skeleton className="w-full h-48" />
          )}
          {coverExtra}
          <ProfileCoverActionSheet
            ref={coverSheetRef}
            coverPreviewSource={coverPreviewSource}
            onPickImage={handlePickCover}
            onConfirm={handleConfirmCover}
            onClose={handleCloseCoverSheet}
            canConfirm={!!draftCoverFile}
            isPending={isCoverUploadPending || isUpdateCoverPending}
          />
          {(isCoverUploadPending || isUpdateCoverPending) && (
            <View className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
              <Loader isPending={true} size="large" />
            </View>
          )}

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
          {/* Header */}
          <View className="flex-row items-center px-4 -mt-12">
            <ProfilePhotoPreview source={uploadProfilePicture}>
              <View>{profilePicture}</View>
            </ProfilePhotoPreview>

            <View className="flex flex-row flex-1 mt-16">
              <View className="flex flex-col flex-1 items-start justify-between px-4 gap-2">
                <View className="flex flex-col items-start">
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

            <View>
              {overrideContent && customContent ? customContent : null}
            </View>
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
                >
                  {() => <AboutTab user={user} />}
                </Tab.Screen>

                <Tab.Screen
                  name="career"
                  options={{
                    tabBarLabel: "Career",
                  }}
                >
                  {() => <ExperienceTab profileSections={profileSections} />}
                </Tab.Screen>
                <Tab.Screen
                  name="gallery"
                  options={{
                    tabBarLabel: "Gallery",
                  }}
                >
                  {() => <SnippetsTab profileSections={profileSections} />}
                </Tab.Screen>
              </Tab.Navigator>
            </View>
            {/* <View>{!overrideContent && customContent ? customContent : null}</View> */}
          </View>
        </React.Fragment>
      )}
    </ScrollView>
  );
};
