import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react-native";
import { useRTL } from "@/hooks/useRTL";
import { useColorPalette } from "@/hooks/useColorPalette";
import { Pressable } from "react-native";

interface TappableProps {
  className?: string;
  classNames?: {
    content?: string;
    pressable?: string;
  };
  children?: React.ReactNode;
  onPress?: () => void;
}

export const Tappable = ({
  className,
  classNames = {
    content: "text-muted-foreground",
    pressable: "bg-primary/25",
  },
  children,
  onPress,
}: TappableProps) => {
  const { palette } = useColorPalette();
  const isRTL = useRTL();
  return (
    <Pressable
      className={cn(
        "flex flex-row items-center justify-between py-4 px-2 active:opacity-50",
        `active:${classNames?.pressable}`,
        className,
      )}
      onPress={onPress}
    >
      <Text className={cn("text-sm", classNames?.content)}>{children}</Text>
      <Icon
        as={isRTL ? ChevronLeft : ChevronRight}
        size={20}
        color={palette.foreground}
      />
    </Pressable>
  );
};
