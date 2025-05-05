import { LucideIcon, LucideProps } from "lucide-react-native";
import { Platform, View } from "react-native";
import { iconWithClassName } from "./icons/iconWithClassName";
import { cn } from "./utils";

type IconProps = LucideProps & {
  name: LucideIcon;
};

const Icon = ({
  name: LucideIcon,
  className,
  size = 32,
  ...props
}: IconProps) => {
  iconWithClassName(LucideIcon);

  const iconClassName = Platform.select({
    native: className,
  });

  const viewClassName = Platform.select({
    web: cn("[&>svg]:size-full", className),
  });

  return (
    <View className={viewClassName}>
      <LucideIcon
        className={cn("text-foreground", iconClassName)}
        size={size}
        {...props}
      />
    </View>
  );
};

export default Icon;
