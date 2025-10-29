import { ArrowLeft } from "lucide-react-native";
import { Pressable } from "react-native";
import { cn } from "~/lib/utils";
import { Icon } from "./ui/icon";
import { router } from "expo-router";

interface BackButtonProps {
  className?: string;
  size?: number;
}

export const BackButton = ({ className, size = 24 }: BackButtonProps) => {
  return (
    <Pressable
      className={cn("flex flex-row items-center gap-2", className)}
      onPress={() => router.back()}
    >
      <Icon as={ArrowLeft} size={size} />
    </Pressable>
  );
};
