import { useColorScheme } from "./useColorScheme";

interface IconWithThemeProps {
  className?: string;
  icon: React.ElementType;
  size: number;
  color?: string;
}

export const IconWithTheme = ({
  className,
  icon: Icon,
  size,
  color
}: IconWithThemeProps) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Icon
      className={className}
      size={size}
      color={color || isDarkColorScheme ? "#ffffff" : "#000000"}
    />
  );
};
