import React, { useRef } from "react";
import { ActionSheetRef } from "react-native-actions-sheet";
import * as Haptics from "expo-haptics";
import { Keyboard, Pressable, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  FadeIn,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";
import { Eye, Camera } from "lucide-react-native";
import { PhotoPreview, PhotoPreviewRef } from "../shared/PhotoPreview";
import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { toast } from "sonner-native";
import {
  ResponseUserDto,
  Upload,
  UpdateUserCoverDto,
  ServerErrorResponse,
} from "@/types";
import { useLoader } from "@/contexts/LoaderContext";
import { useServerImages } from "@/hooks/content/useServerImages";
import { Image, ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useUploadMutation } from "@/hooks/content/useUploadMutation";
import { ThreeDotsActionSheet } from "../shared/ThreeDotsActionSheet";
import { useLuminance } from "@/hooks/useLuminance";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ProfileCoverProps {
  user: ResponseUserDto;
  currentUser: ResponseUserDto | null;
  onRefresh: () => void;
  coverExtra?: React.ReactNode;
}

export const ProfileCover = ({
  user,
  currentUser,
  onRefresh,
  coverExtra,
}: ProfileCoverProps) => {
  const { t } = useTranslation("menu");
  const queryClient = useQueryClient();
  const [isPickingCover, setIsPickingCover] = React.useState(false);
  const { setLoading } = useLoader();

  const sheetRef = useRef<ActionSheetRef>(null);
  const previewRef = useRef<PhotoPreviewRef>(null);

  const isCurrentUser = currentUser?.id === user?.id;

  const { uploads: coverUploads } = useServerImages({
    ids: [user?.coverId],
    fallbacks: [""],
    wrapperClassName: "",
    size: { width: 100, height: 100 },
  });
  const coverSource = coverUploads?.[0];

  const { uploadFiles: uploadCover, isUploadPending: isCoverUploadPending } =
    useUploadMutation({
      onSuccess: (response: Upload[]) => {
        const coverId = response?.[0]?.id;
        if (coverId) {
          updateUserCover({ coverId });
        }
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(
          error.response?.data?.message || t("menu.toasts.uploadError"),
          {},
        );
      },
    });

  const { mutate: updateUserCover, isPending: isUpdateCoverPending } =
    useMutation({
      mutationFn: (coverDto: UpdateUserCoverDto) =>
        api.client.updateCover(coverDto),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", currentUser?.id] });
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        if (currentUser?.coverId) {
          queryClient.invalidateQueries({
            queryKey: ["server-image", currentUser.coverId],
          });
        }
        onRefresh();
        toast.success(t("menu.toasts.coverUpdated"), {
          description: t("menu.toasts.coverUpdatedDescription"),
        });
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(
          error.response?.data?.message || t("menu.toasts.coverError"),
          {},
        );
      },
    });

  React.useEffect(() => {
    setLoading(isCoverUploadPending || isUpdateCoverPending || isPickingCover);
  }, [isCoverUploadPending, isUpdateCoverPending, isPickingCover, setLoading]);

  React.useEffect(() => {
    return () => setLoading(false);
  }, [setLoading]);

  const scale = useSharedValue(1);
  const pressOverlay = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: pressOverlay.value,
  }));

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withTiming(0.98, {
      duration: 75,
      easing: Easing.out(Easing.quad),
    });
    pressOverlay.value = withTiming(0.2, { duration: 75 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 320, mass: 0.6 });
    pressOverlay.value = withTiming(0, { duration: 120 });
  };

  const handlePickCover = async () => {
    if (!isCurrentUser) return;

    setIsPickingCover(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const fileLike = {
        uri: asset.uri,
        name: asset.uri.split("/").pop() || "cover.jpg",
        type: asset.mimeType || "image/jpeg",
      } as unknown as File;

      uploadCover({
        files: [fileLike],
      });
    } finally {
      setIsPickingCover(false);
    }
  };

  const handlePress = () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isCurrentUser) {
      sheetRef.current?.show();
    } else if (coverSource) {
      previewRef.current?.open();
    }
  };

  const { isLight: isLightCover } = useLuminance(
    coverSource as ImageSource | undefined,
  );
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <>
      <AnimatedPressable
        entering={FadeIn.duration(400)}
        className={cn(
          "relative w-full h-56 overflow-hidden items-center justify-center bg-primary/25",
        )}
        style={animatedStyle}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        {coverExtra}

        {/* Cover Image */}
        {coverSource ? (
          <Image
            source={coverSource}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : isCurrentUser ? (
          <View className="flex flex-row items-center justify-center gap-2 z-10" />
        ) : null}

        {/* Dynamic Calque Overlay */}
        <LinearGradient
          colors={
            isHovered
              ? ["rgba(0,0,0,0.65)", "rgba(0,0,0,0.80)"]
              : isLightCover
                ? ["rgba(0,0,0,0.35)", "rgba(0,0,0,0.55)"]
                : ["rgba(0,0,0,0.15)", "rgba(0,0,0,0.35)"]
          }
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />

        {/* Animated Touch Press Dark Overlay */}
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: "black",
            },
            animatedOverlayStyle,
          ]}
          pointerEvents="none"
        />
      </AnimatedPressable>

      <PhotoPreview
        ref={previewRef}
        source={coverSource as ImageSource | undefined}
      />

      <ThreeDotsActionSheet
        ref={sheetRef}
        renderTrigger={false}
        options={[
          {
            label: t("menu.actions.viewPhoto"),
            icon: Eye,
            disabled: !coverSource,
            onPress: () => {
              setTimeout(() => {
                previewRef.current?.open();
              }, 300);
            },
          },
          {
            label: t("menu.actions.updatePhoto"),
            icon: Camera,
            onPress: () => {
              setTimeout(() => {
                handlePickCover();
              }, 300);
            },
          },
        ]}
      />
    </>
  );
};
