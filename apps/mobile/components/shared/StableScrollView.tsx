import { ScrollView } from "react-native";

interface StableScrollViewProps {
  className?: string;
  children: React.ReactNode;
}

export const StableScrollView = ({
  className,
  children,
}: StableScrollViewProps) => {
  return (
    <ScrollView
      bounces={false}
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      overScrollMode="never"
      className={className}
    >
      {children}
    </ScrollView>
  );
};
