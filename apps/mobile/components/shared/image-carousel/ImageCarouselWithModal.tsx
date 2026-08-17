import React from "react";
import { View, Dimensions } from "react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { Image, ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { THEME } from "~/lib/theme";
import { UseQueryResult } from "@tanstack/react-query";
import { cn } from "~/lib/utils";
import { Loader } from "../Loader";
import { PhotoPreview } from "../PhotoPreview";

interface ImageCarouselProps {
  uploads: string[];
  imageQueries: UseQueryResult<string, Error>[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  heightScale?: number;
}

export const ImageCarousel = ({
  uploads,
  imageQueries,
  className,
  autoPlay,
  autoPlayInterval = 3000,
  heightScale = 0.36,
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { colorScheme } = useColorScheme();

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
    return imageQueries
      .map((q) => q.data)
      .filter(
        (data): data is string => typeof data === "string" && data.length > 0,
      ) as ImageSource[];
  }, [imageQueries]);

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
              data={uploads}
              onProgressChange={progress}
              onSnapToItem={(index) => setCurrentIndex(index)}
              autoPlay={autoPlay}
              autoPlayInterval={autoPlayInterval}
              renderItem={({ index }) => {
                const query = imageQueries[index];

                if (!query?.data) {
                  return (
                    <View className="flex-1 justify-center items-center">
                      <Loader />
                    </View>
                  );
                }

                return (
                  <Image
                    source={{ uri: query.data }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                );
              }}
            />
          </View>

          <View className="absolute bottom-3 z-10 flex-row items-center justify-center w-full">
            <Pagination.Basic
              progress={progress}
              data={uploads}
              dotStyle={{
                backgroundColor:
                  colorScheme === "dark"
                    ? THEME.dark.primary
                    : THEME.light.primary,
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
