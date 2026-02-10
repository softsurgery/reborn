import React from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";
import { THEME } from "~/lib/theme";
import { Text } from "~/components/ui/text";
import { UseQueryResult } from "@tanstack/react-query";
import { ImageCarouselModal } from "./ImageCarouselModal";
import { useImageCarouselModal } from "~/hooks/useImageCarouselModal";
import { cn } from "~/lib/utils";

interface ImageCarouselWithModalProps {
  uploads: string[];
  imageQueries: UseQueryResult<string, Error>[];
  className?: string;
  title?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const ImageCarouselWithModal = ({
  uploads,
  imageQueries,
  className,
  title,
  autoPlay = true,
  autoPlayInterval = 3000,
}: ImageCarouselWithModalProps) => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { colorScheme } = useColorScheme();
  const { isVisible, currentIndex, setCurrentIndex, open, close } =
    useImageCarouselModal();

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height * 0.2;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const handleImagePress = () => {
    setCurrentIndex(Math.round(progress.value));
    open();
  };

  // Get image URLs from queries
  const imageUrls = React.useMemo(() => {
    return imageQueries
      .filter((query) => query.data)
      .map((query) => query.data as string);
  }, [imageQueries]);

  return (
    <>
      <TouchableOpacity
        onPress={handleImagePress}
        activeOpacity={0.9}
        className={cn(className)}
      >
        <View className="flex flex-col items-center">
          <Carousel
            ref={ref}
            width={width}
            height={height}
            data={uploads}
            onProgressChange={progress}
            autoPlay={autoPlay}
            autoPlayInterval={autoPlayInterval}
            renderItem={({ index }) => {
              const query = imageQueries[index];

              if (!query?.data) {
                return (
                  <View className="justify-center items-center">
                    <Text>Loading...</Text>
                  </View>
                );
              }

              return (
                <View className="justify-center items-center">
                  <Image
                    source={{ uri: query.data }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    resizeMode="cover"
                  />
                </View>
              );
            }}
          />
          <Pagination.Basic
            progress={progress}
            data={uploads}
            dotStyle={{
              backgroundColor:
                colorScheme == "dark"
                  ? THEME.dark.primary
                  : THEME.light.primary,
              borderRadius: 50,
            }}
            containerStyle={{ gap: 5, marginTop: -20 }}
            onPress={onPressPagination}
          />
        </View>
      </TouchableOpacity>

      <ImageCarouselModal
        visible={isVisible}
        images={imageUrls}
        initialIndex={currentIndex}
        onClose={close}
        title={title}
      />
    </>
  );
};
