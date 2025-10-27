import { View } from "react-native";
import { cn } from "~/lib/utils";
import { LucideIcon } from "lucide-react-native";
import { Text } from "../ui/text";
import { StablePressable } from "../shared/StablePressable";
import { IconBadge } from "../ui/icon-badge";
import { Icon } from "../ui/icon";
import { badgeTextVariants } from "../ui/badge";

type Shortcut =
  | {
      icon: LucideIcon;
      onPress: () => void;
      badgeText?: string;
    }
  | React.ReactNode;

interface ApplicationHeaderProps {
  className?: string;
  title: string;
  shortcuts?: Shortcut[];
}
export const ApplicationHeader = ({
  className,
  title,
  shortcuts,
}: ApplicationHeaderProps) => {
  return (
    <View
      className={cn(
        "flex flex-row justify-between items-center gap-2 px-2",
        className
      )}
    >
      <Text variant="h1">{title}</Text>
      <View className="flex flex-row gap-2">
        {shortcuts?.map((shortcut, index) => {
          if (
            shortcut !== null &&
            typeof shortcut === "object" &&
            "icon" in shortcut
          ) {
            return (
              <StablePressable
                key={index}
                className="p-1"
                onPress={shortcut.onPress}
              >
                {shortcut.badgeText ? (
                  <IconBadge
                    as={shortcut.icon}
                    size={28}
                    badgeText={shortcut.badgeText}
                  />
                ) : (
                  <Icon as={shortcut.icon} size={28} />
                )}
              </StablePressable>
            );
          }
          return shortcut;
        })}
      </View>
    </View>
  );
};
