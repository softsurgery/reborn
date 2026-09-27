import { View } from "react-native";
import { Text } from "../ui/text";
import { cn } from "@/lib/utils";

interface StatCardProps {
  className?: string;
  title: string;
  value: number;
  subtitle: string;
  loading: boolean;
}

export const StatCard = ({
  className,
  title,
  value,
  subtitle,
  loading,
}: StatCardProps) => {
  return (
    <View
      className={cn(
        "flex-1 rounded-xl border border-border bg-card",
        className,
      )}
    >
      <Text className="text-xs text-muted-foreground">{title}</Text>

      <Text className="text-2xl font-semibold mt-1">
        {loading ? "-" : value}
      </Text>

      <Text className="text-xs text-muted-foreground mt-1">{subtitle}</Text>
    </View>
  );
};
