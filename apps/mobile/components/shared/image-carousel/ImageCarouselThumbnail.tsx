import React from "react";
import { TouchableOpacity, View, type ViewStyle } from "react-native";
import { Image, ImageStyle } from "expo-image";
import { cn } from "~/lib/utils";
import { ImageCarouselModal } from "./ImageCarouselModal";
import { useImageCarouselModal } from "~/hooks/useImageCarouselModal";

interface ImageCarouselThumbnailProps {
  images: string[];
  currentImageIndex?: number;
  className?: string;
  title?: string;
  resizeMode?: "cover" | "contain" | "stretch" | "center";
  height?: number | string;
  width?: number | string;
  isLoading?: boolean;
  onImageClick?: (index: number) => void;
}

export const ImageCarouselThumbnail = ({
  images,
  currentImageIndex = 0,
  className,
  title,
  resizeMode = "cover",
  height = "100%",
  width = "100%",
  isLoading = false,
  onImageClick,
}: ImageCarouselThumbnailProps) => {
  const { isVisible, currentIndex, setCurrentIndex, open, close } =
    useImageCarouselModal();

  const handlePress = () => {
    setCurrentIndex(currentImageIndex);
    onImageClick?.(currentImageIndex);
    open();
  };

  if (isLoading || !images[currentImageIndex]) {
    return (
      <View
        className={cn("bg-muted justify-center items-center", className)}
        style={{ height, width } as ViewStyle}
      >
        <View className="w-full h-full bg-skeleton" />
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Image
          source={{ uri: images[currentImageIndex] }}
          style={
            {
              height,
              width,
            } as ImageStyle
          }
          resizeMode={resizeMode}
          className={cn("bg-muted", className)}
        />
      </TouchableOpacity>

      <ImageCarouselModal
        visible={isVisible}
        images={images}
        initialIndex={currentIndex}
        onClose={close}
        title={title}
      />
    </>
  );
};
