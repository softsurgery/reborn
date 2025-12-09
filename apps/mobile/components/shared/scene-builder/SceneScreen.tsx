import { router } from "expo-router";
import { View } from "react-native";
import { useSceneContext } from "./SceneContext";
import { StableSafeAreaView } from "../StableSafeAreaView";
import { cn } from "~/lib/utils";
import { SceneBuilder } from "./SceneBuilder";
import { Text } from "~/components/ui/text";
import { StablePressable } from "../StablePressable";

interface SceneScreenProps {
  id: string;
  className?: string;
}

export const SceneScreen = ({ className, id }: SceneScreenProps) => {
  const { scenes } = useSceneContext();
  return (
    <StableSafeAreaView className={cn("flex-1 bg-card")}>
      {scenes?.[id] ? (
        <SceneBuilder scene={scenes?.[id]} className={className} />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text variant={"h1"} className="text-center text-primary">
            404
          </Text>
          <StablePressable className="p-2 rounded-lg" onPress={router.back}>
            <Text variant={"h3"} className="text-center">
              Go Back
            </Text>
          </StablePressable>
        </View>
      )}
    </StableSafeAreaView>
  );
};
