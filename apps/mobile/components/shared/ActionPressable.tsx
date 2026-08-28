import { useColorPalette } from "@/hooks/useColorPalette";
import { cn } from "@/lib/utils";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

interface ActionPressableProps {
  classNames?: {
    wrapper?: string;
    title?: string;
    icon?: string;
  };
  title: string;
  description: string;
  IconComp: LucideIcon;
  onPress?: () => void;
  disabled?: boolean;
  isLast?: boolean;
  isPending?: boolean;
}

export const ActionPressable = ({
  classNames,
  title,
  description,
  IconComp,
  onPress,
  disabled,
  isLast = false,
  isPending = false,
}: ActionPressableProps) => {
  const { palette } = useColorPalette();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isPending}
      className={cn(
        "flex-row items-center justify-between active:opacity-50",
        !isLast ? "border-b border-border/40" : "",
        disabled ? "opacity-50" : "",
        classNames?.wrapper,
      )}
    >
      <View className="flex-row items-center gap-3.5">
        <View
          className={cn(
            `w-9 h-9 rounded-xl items-center justify-center`,
            classNames?.icon,
          )}
        >
          {isPending ? (
            <ActivityIndicator size="small" />
          ) : (
            <IconComp size={18} color={palette.foreground} />
          )}
        </View>
        <View>
          <Text
            className={cn(
              "text-sm text-foreground font-semibold",
              classNames?.title,
            )}
          >
            {title}
          </Text>
          <Text className="text-muted-foreground text-xs">{description}</Text>
        </View>
      </View>
      <ChevronRight size={18} color={palette.foreground} />
    </Pressable>
  );
};
