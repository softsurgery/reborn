import { useColorScheme } from "./useColorScheme";

interface IconWithThemeProps {
  className?: string;
  icon: React.ElementType;
  size: number;
}

export const IconWithTheme = ({
  className,
  icon: Icon,
  size,
}: IconWithThemeProps) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Icon
      className={className}
      size={size}
      color={isDarkColorScheme ? "#ffffff" : "#000000"}
    />
  );
};
