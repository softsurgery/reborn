import { useColorScheme } from "./useColorScheme";

interface IconWithThemeProps {
  icon: React.ElementType;
  size: number;
}

export const IconWithTheme = ({ icon: Icon,size }: IconWithThemeProps) => {
  const { isDarkColorScheme } = useColorScheme();
  return <Icon size={size} color={isDarkColorScheme ? "#000000" : "#ffffff"}  />;
};
