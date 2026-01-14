import * as React from "react";
import { Image, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { router } from "expo-router";
import Logo from "~/assets/images/reborn.svg";
import { Dimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { useColorScheme } from "nativewind";
import { THEME } from "~/lib/theme";

const data = [...new Array(3).keys()];
const width = Dimensions.get("window").width;

interface OnBoardingProps {
  className?: string;
}

export default function OnBoarding({ className }: OnBoardingProps) {
  const { colorScheme } = useColorScheme();
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
  return (
    <StableSafeAreaView
      className={cn("flex-1 justify-between mb-8", className)}
    >
      <View className="flex-1 flex flex-col justify-between">
        <View className="flex flex-row gap-2 px-4 items-center mt-5">
          <Logo width={40} height={40} />
          <Text className="text-[22px] font-bold italic">REBORN</Text>
        </View>

        <View>
          <Carousel
            width={width}
            ref={ref}
            style={{ width, height: width }}
            data={data}
            onProgressChange={progress}
            renderItem={({ index }) => (
              <View className="justify-center items-center">
                <Logo width={320} height={320} />
              </View>
            )}
            autoPlayInterval={3000}
            autoPlay
          />

          <Pagination.Basic
            progress={progress}
            data={data}
            dotStyle={{
              backgroundColor:
                colorScheme == "dark"
                  ? THEME.dark.primary
                  : THEME.light.primary,
              borderRadius: 50,
            }}
            containerStyle={{ gap: 5, marginTop: 10 }}
            onPress={onPressPagination}
          />
        </View>

        <View className="flex flex-row gap-2 mt-5 px-4">
          <Button
            className="flex-1"
            variant="outline"
            onPress={() => router.navigate("/auth/sign-in")}
          >
            <Text className="text-3xl tracking-wider font-bold">
              {"Get Started".toUpperCase()}
            </Text>
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onPress={() => router.navigate("/auth/sign-in")}
          >
            <Text className="text-3xl tracking-wider font-bold">
              {"Get Started".toUpperCase()}
            </Text>
          </Button>
        </View>
      </View>
    </StableSafeAreaView>
  );
}
