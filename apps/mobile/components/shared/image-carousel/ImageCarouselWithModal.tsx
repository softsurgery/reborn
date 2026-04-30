import React from "react";
import { View, Dimensions } from "react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";
import { THEME } from "~/lib/theme";
import { UseQueryResult } from "@tanstack/react-query";
import { cn } from "~/lib/utils";
import { StablePressable } from "../StablePressable";
import { Icon } from "../../ui/icon";
import { Expand } from "lucide-react-native";
import { Loader } from "../Loader";
import { PhotoPreview } from "../PhotoPreview";

interface ImageCarouselProps {
  uploads: string[];
  imageQueries: UseQueryResult<string, Error>[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  heightScale?: number;
  extraActions?: {
    icon: React.ReactNode;
    onPress: () => void;
  }[];
}

export const ImageCarousel = ({
  uploads,
  imageQueries,
  className,
  autoPlay,
  autoPlayInterval = 3000,
  heightScale = 0.4,
  extraActions,
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { colorScheme } = useColorScheme();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const expandedHeight = screenHeight * heightScale;
  const collapsedHeight = screenHeight * 0.15;

  const animatedHeight = useSharedValue(expandedHeight);

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(animatedHeight.value, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    }),
  }));

  const resize = () => {
    animatedHeight.value =
      animatedHeight.value === expandedHeight
        ? collapsedHeight
        : expandedHeight;
  };

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <PhotoPreview
      source={imageQueries.map((q) => q.data as string)}
      index={currentIndex}
    >
      <View className={cn(className)}>
        <View className="relative w-full items-center overflow-hidden">
          <StablePressable
            className="absolute top-3 right-3 z-10 bg-black/50 p-2 rounded-full"
            onPress={resize}
          >
            <Icon as={Expand} size={22} color="white" />
          </StablePressable>

          <View className="absolute top-3 left-3 z-10 flex flex-row gap-2">
            {extraActions?.map((action, index) => (
              <StablePressable
                key={index}
                className="bg-black/50 p-2 rounded-full"
                onPress={action.onPress}
              >
                {action.icon}
              </StablePressable>
            ))}
          </View>

          <Animated.View
            style={[
              {
                width: screenWidth,
                overflow: "hidden",
              },
              animatedStyle,
            ]}
          >
            <Carousel
              ref={ref}
              width={screenWidth}
              height={expandedHeight}
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
          </Animated.View>

          <View className="mt-4">
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
