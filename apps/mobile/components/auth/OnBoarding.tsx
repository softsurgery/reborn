import { Image } from "expo-image";
import * as React from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { StableSafeAreaView } from "../shared/stables/StableSafeAreaView";
import { SSOButtons } from "./SSOButtons";
import { Rocket, Zap, ShieldCheck, Languages } from "lucide-react-native";
import { useColorPalette } from "@/hooks/useColorPalette";
import { ThemeToggle } from "../shared/ThemeToggle";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { Icon } from "../ui/icon";
import { AcceptTerms } from "./AcceptTerms";

const width = Dimensions.get("window").width;

const ONBOARDING_DATA = [
  {
    title: "Welcome to Reborn",
    description:
      "Experience the next generation of connectivity with our cutting-edge platform tailored just for you.",
    icon: Rocket,
  },
  {
    title: "Seamless Integration",
    description:
      "Sync your data effortlessly and enjoy a flawless experience across all your devices, anywhere, anytime.",
    icon: Zap,
  },
  {
    title: "Secure & Private",
    description:
      "Your privacy is our top priority. We employ industry-leading security to keep your information safe.",
    icon: ShieldCheck,
  },
];

interface OnBoardingProps {
  className?: string;
}

export default function OnBoarding({ className }: OnBoardingProps) {
  const { palette } = useColorPalette();
  const ref = React.useRef<ICarouselInstance>(null);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <StableSafeAreaView
      className={cn("flex-1 justify-between bg-background", className)}
    >
      <View className="flex-1 flex flex-col justify-between py-4">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row gap-3 px-6 items-center">
            <Image
              source={require("~/assets/images/reborn.png")}
              style={{ width: 60, height: 60, borderRadius: 12 }}
              contentFit="cover"
            />
            <Text className="text-3xl font-extrabold tracking-tight mt-2">
              Reborn
            </Text>
          </View>
          <View className="flex flex-row items-center mr-4">
            <LanguageSwitcher
              customTrigger={
                <View className="mx-2">
                  <Icon as={Languages} className="text-foreground" size={24} />
                </View>
              }
            />
            <ThemeToggle className="mx-2" />
          </View>
        </View>

        <View className="flex-1 justify-center mt-8">
          <Carousel
            width={width}
            ref={ref}
            style={{ width: width, height: 250 }}
            data={ONBOARDING_DATA}
            onProgressChange={progress}
            renderItem={({ item, index }) => {
              const IconComponent = item.icon;
              return (
                <View className="flex-1 justify-center items-center px-8">
                  <View className="bg-primary/10 p-6 rounded-full mb-2">
                    <IconComponent
                      size={80}
                      color={palette.primary}
                      strokeWidth={1.5}
                    />
                  </View>
                  <Text className="text-3xl font-bold text-center mb-4 text-foreground">
                    {item.title}
                  </Text>
                  <Text className="text-base text-center text-muted-foreground leading-relaxed">
                    {item.description}
                  </Text>
                </View>
              );
            }}
            autoPlayInterval={4000}
            autoPlay
          />

          <Pagination.Basic
            progress={progress}
            data={ONBOARDING_DATA}
            dotStyle={{
              backgroundColor: palette.mutedForeground,
              borderRadius: 50,
              width: 8,
              height: 8,
            }}
            activeDotStyle={{
              backgroundColor: palette.foreground,
              width: 24,
              height: 8,
              borderRadius: 50,
            }}
            containerStyle={{ gap: 8, marginTop: 24 }}
            onPress={onPressPagination}
          />
        </View>
        <View className="mx-6 mt-8 mb-4">
          <AcceptTerms
            className="mt-4"
            checked={acceptedTerms}
            onCheckedChange={setAcceptedTerms}
          />
          <SSOButtons
            isSignInPending={false}
            acceptedTerms={acceptedTerms}
            classic
          />
        </View>
      </View>
    </StableSafeAreaView>
  );
}
