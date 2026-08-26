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
    <View
      className={cn(
        "p-4 flex flex-col gap-3 mb-5 shadow-xs",
        status.cardBg,
        className,
      )}
    >
      <View className="flex flex-row items-center justify-between gap-2">
        <View className="flex flex-row items-center gap-2 flex-1 min-w-0">
          <View
            className={cn(
              "w-8 h-8 rounded-full items-center justify-center shrink-0",
              status.iconBg,
            )}
          >
            <Icon as={status.icon} size={18} />
          </View>
          <Text
            className="text-sm font-extrabold text-foreground flex-1"
            numberOfLines={1}
          >
            {status.label}
          </Text>
        </View>

        <Badge
          variant="outline"
          className={cn("px-2.5 py-0.5 shrink-0", status.badgeStyle)}
        >
          <Text className="text-sm">
            {request.createdAt ? timeAgo(request.createdAt) : "Recently"}
          </Text>
        </Badge>
      </View>

      <Text className="text-xs text-muted-foreground leading-relaxed">
        {status.description}
      </Text>

      {request.createdAt && (
        <View className="flex flex-row items-center gap-1.5 pt-2">
          <Icon as={Clock} size={12} color={palette?.foreground} />
          <Text className="text-sm font-medium text-muted-foreground">
            Submitted:{" "}
            {format(new Date(request.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
          </Text>
        </View>
      )}
    </View>
  );
};
