import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorPalette } from "@/hooks/useColorPalette";
import { timeAgo } from "@/lib/dates.utils";
import { cn } from "@/lib/utils";
import { ResponseJobRequestDto } from "@/types";
import { format } from "date-fns";
import { Clock } from "lucide-react-native";
import { View } from "react-native";
import { RequestStatus } from "./RequestDetails";

interface RequestBannerProps {
  className?: string;
  status: RequestStatus;
  request: ResponseJobRequestDto;
}

export const RequestBanner = ({
  className,
  status,
  request,
}: RequestBannerProps) => {
  const { palette } = useColorPalette();
  return (
    <View className={cn("flex flex-col gap-1 p-4", status.cardBg, className)}>
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2 py-2">
          <View
            className={cn(
              "rounded-full items-center justify-center shrink-0",
              status.iconBg,
            )}
          >
            <Icon as={status.icon} size={18} color={palette?.foreground} />
          </View>
          <Text
            className="text-base font-bold text-foreground flex-1"
            numberOfLines={1}
          >
            {status.label}
          </Text>
        </View>
      </View>

      <Text className="text-xs text-muted-foreground leading-relaxed">
        {status.description}
      </Text>

      {request.createdAt && (
        <View className="flex flex-row items-center gap-2 pt-2">
          <Icon as={Clock} size={12} color={palette?.foreground} />
          <Text className="text-sm font-medium text-muted-foreground">
            Submitted:{" "}
            {format(new Date(request.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
          </Text>
          <Badge
            variant="outline"
            className={cn("px-2.5 py-0.5 shrink-0", status.badgeStyle)}
          >
            <Text className="text-xs">
              {request.createdAt ? timeAgo(request.createdAt) : "Recently"}
            </Text>
          </Badge>
        </View>
      )}
    </View>
  );
};
