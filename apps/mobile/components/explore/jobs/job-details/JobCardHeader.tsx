import {
  CheckCircle,
  Clock,
  FileText,
  Heart,
  Star,
  Wallet,
} from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { timeAgo } from "~/lib/dates.utils";
import { cn } from "~/lib/utils";
import { ResponseJobDto, ResponseJobMetadataDto } from "~/types";

interface JobCardHeaderProps {
  className?: string;
  job: ResponseJobDto | null;
  metadata: ResponseJobMetadataDto | null;
  handleSave: (e: any) => void;
  isSavePending: boolean;
  isUnsavePending: boolean;
  isJobSaved: boolean;
}

export const JobCardHeader = ({
  className,
  job,
  metadata,
  handleSave,
  isSavePending,
  isUnsavePending,
  isJobSaved,
}: JobCardHeaderProps) => {
  return (
    <View
      className={cn("bg-muted px-6 py-5 border-b border-border", className)}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1 pr-4">
          <Text className="text-lg font-bold text-foreground mb-1">
            {job?.title}
          </Text>
          <View className="flex flex-row gap-2">
            <View className="flex-row items-center gap-1">
              <Clock size={14} color="#9ca3af" />
              <Text className="text-xs text-muted-foreground">
                {timeAgo(job?.createdAt || new Date())}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Wallet size={14} color="#9ca3af" />
              <Text className="text-xs text-muted-foreground">
                {job?.price.toFixed(3)} TND
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSavePending || isUnsavePending}
        >
          {isSavePending || isUnsavePending ? (
            <Heart size={24} color={"#FAA0A0"} fill={"#FAA0A0"} />
          ) : (
            <Heart
              size={24}
              color={"#EE4B2B"}
              fill={isJobSaved ? "#EE4B2B" : "none"}
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center gap-3">
        <View className="flex-row items-center gap-1">
          <FileText size={14} color="#6366f1" />
          <Text className="text-xs text-card-foreground">
            {metadata?.requestCount} proposals
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <CheckCircle size={14} color="#16a34a" />
          <Text className="text-xs text-card-foreground">Payment verified</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Star size={14} color="#fbbf24" fill="#fbbf24" />
          <Text className="text-xs text-card-foreground">
            4.8 client rating
          </Text>
        </View>
      </View>
    </View>
  );
};
