import { ArrowLeft } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { Icon } from "./ui/icon";
import { router } from "expo-router";
import { StablePressable } from "./shared/StablePressable";

interface BackButtonProps {
  className?: string;
  size?: number;
}

export const BackButton = ({ className, size = 24 }: BackButtonProps) => {
  return (
    <StablePressable
      className={cn("flex flex-row items-center justify-center", className)}
      onPress={() => router.back()}
    >
      <Icon as={ArrowLeft} size={size} />
    </StablePressable>
  );
};
