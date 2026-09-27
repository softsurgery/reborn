import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface JobSearchResultEntrySkeletonProps {
  className?: string;
}

export const JobSearchResultEntrySkeleton = ({
  className,
}: JobSearchResultEntrySkeletonProps) => {
  return (
    <View className={cn("p-4 flex-row items-start justify-between", className)}>
      <View className="flex-1 mr-4">
        {/* Title */}
        <Skeleton className="h-5 w-3/4 mb-1 rounded-md" />
        {/* Description */}
        <Skeleton className="h-4 w-full mb-1 rounded-md mt-2" />
        <Skeleton className="h-4 w-5/6 mb-1 rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </View>
      {/* Time */}
      <Skeleton className="h-4 w-12 shrink-0 rounded-md" />
    </View>
  );
};
