import { useColorPalette } from "@/hooks/useColorPalette";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { LucideIcon, LucideProps } from "lucide-react-native";

type IconProps = LucideProps & {
  className?: string;
  as: LucideIcon;
};

function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

function Icon({
  as: IconComponent,
  className,
  size = 14,
  color,
  fill,
  ...props
}: IconProps) {
  const { palette } = useColorPalette();
  return (
    <IconImpl
      as={IconComponent}
      className={cn(className)}
      size={size}
      color={color || palette.foreground}
      fill={fill || "transparent"}
      {...props}
    />
  );
}

export { Icon };
