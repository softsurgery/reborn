import { useColorScheme } from "./useColorScheme";

interface IconWithThemeProps {
  className?: string;
  icon: React.ElementType;
  size: number;
  color?: string;
  reverse?: boolean;
}

export const IconWithTheme = ({
  className,
  icon: Icon,
  size,
  color,
  reverse = false,
}: IconWithThemeProps) => {
  const { isDarkColorScheme } = useColorScheme();

  const themeColor =
    color ||
    (reverse
      ? isDarkColorScheme
        ? "#000000"
        : "#ffffff"
      : isDarkColorScheme
      ? "#ffffff"
      : "#000000");

  return <Icon className={className} size={size} color={themeColor} />;
};
