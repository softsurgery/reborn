import React from "react";
import { View, Dimensions } from "react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { Image, ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { UseQueryResult } from "@tanstack/react-query";
import { cn } from "~/lib/utils";
import { Loader } from "../lotties/Loader";
import { PhotoPreview } from "../PhotoPreview";
import { useColorPalette } from "@/hooks/useColorPalette";

interface ImageCarouselProps {
  uploads?: string[];
  images?: (ImageSource | undefined)[];
  imageQueries?: UseQueryResult<ImageSource, Error>[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  heightScale?: number;
}

export const ImageCarousel = ({
  uploads = [],
  images,
  imageQueries,
  className,
  autoPlay,
  autoPlayInterval = 3000,
  heightScale = 0.36,
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { palette } = useColorPalette();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const carouselHeight = screenHeight * heightScale;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const previewSources = React.useMemo(() => {
    if (images && images.length > 0) {
      return images.filter(
        (data): data is ImageSource =>
          !!data && typeof data === "object" && !!(data as any).uri,
      );
    }
    if (imageQueries && imageQueries.length > 0) {
      return imageQueries
        .map((q) => q.data)
        .filter(
          (data): data is ImageSource =>
            !!data && typeof data === "object" && !!(data as any).uri,
        );
    }
    return [];
  }, [images, imageQueries]);

  const carouselData: any[] = React.useMemo(() => {
    if (images && images.length > 0) return images;
    if (uploads && uploads.length > 0) return uploads;
    if (imageQueries && imageQueries.length > 0) return imageQueries;
    return [];
  }, [images, uploads, imageQueries]);

  const handlePreviewIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
    ref.current?.scrollTo({
      index: newIndex,
      animated: false,
    });
  };

  return (
    <PhotoPreview
      sources={previewSources}
      index={currentIndex}
      onIndexChange={handlePreviewIndexChange}
    >
      <View className={cn(className)}>
        <View className="relative w-full items-center overflow-hidden">
          {/* Top gradient overlay for high contrast header overlay */}
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.1)", "transparent"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 95,
              zIndex: 5,
            }}
            pointerEvents="none"
          />

          <View
            style={{
              width: screenWidth,
              height: carouselHeight,
              overflow: "hidden",
            }}
          >
            <Carousel
              ref={ref}
              width={screenWidth}
              height={carouselHeight}
              data={carouselData}
              onProgressChange={progress}
              onSnapToItem={(index) => setCurrentIndex(index)}
              autoPlay={autoPlay}
              autoPlayInterval={autoPlayInterval}
              renderItem={({ index }) => {
                const imgSource = images
                  ? images[index]
                  : imageQueries
                    ? imageQueries[index]?.data
                    : undefined;

                if (!imgSource) {
                  return (
                    <View className="flex-1 justify-center items-center">
                      <Loader />
                    </View>
                  );
                }

                return (
                  <Image
                    source={imgSource}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                );
              }}
            />
          </View>

          <View className="absolute bottom-3 z-10 flex-row items-center justify-center w-full">
            <Pagination.Basic
              progress={progress}
              data={carouselData}
              dotStyle={{
                backgroundColor: palette.primary,
                borderRadius: 50,
              }}
              containerStyle={{ gap: 5 }}
              onPress={onPressPagination}
            />
          </View>
        </View>
      </View>
    </PhotoPreview>
  );
};
