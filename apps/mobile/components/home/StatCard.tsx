import { View } from "react-native";
import { Text } from "../ui/text";
import { Skeleton } from "../ui/skeleton";

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  loading: boolean;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  loading,
}: StatCardProps) => {
  return (
    <View className="flex-1 rounded-xl border border-border bg-card p-3">
      <Text className="text-xs text-muted-foreground">{title}</Text>

      <Text className="text-2xl font-semibold mt-1">
        {loading ? "-" : value}
      </Text>

      <Text className="text-xs text-muted-foreground mt-1">{subtitle}</Text>
    </View>
  );
};
