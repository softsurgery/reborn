import React from "react";
import { Calendar } from "lucide-react-native";
import { View } from "react-native";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { ResponseJobDto } from "~/types";

interface JobDetailsBodyProps {
  className?: string;
  job: ResponseJobDto | null;
}

export const JobDetailsBody = ({ className, job }: JobDetailsBodyProps) => {
  return (
    <View className={cn(className)}>
      <Separator className="my-4" />
      <View className="flex flex-col gap-4">
        {/* About Project */}
        <View>
          <Text className="text-lg font-semibold text-foreground mb-2">
            About this project
          </Text>
          <Text className="text-card-foreground leading-6 text-sm">
            {job?.description}
          </Text>
        </View>
        {/* Project Scope */}
        <View>
          <Text className="text-lg font-semibold text-foreground mb-2">
            Project scope
          </Text>
          <View className="flex flex-col gap-1">
            <View className="flex-row items-center gap-2">
              <Calendar size={12} color="#6366f1" />
              <Text className="text-xs text-muted-foreground">3-6 months</Text>
            </View>
            <Text className="text-xs text-muted-foreground">
              {job?.difficulty}
            </Text>
            <Text className="text-xs text-muted-foreground">{job?.style}</Text>
          </View>
        </View>
      </View>
      <Separator className="my-4" />
      {/* details */}
      <View className="flex flex-row gap-4">
        {/* Skills */}
        <View>
          <Text className="text-lg font-semibold text-foreground mb-2">
            Tags
          </Text>
          <View className="flex-row flex-wrap gap-1 mt-2 w-full">
            {job?.tags && job?.tags?.length > 0 ? (
              job?.tags.map((tag) => (
                <Badge variant={"secondary"} key={tag.id}>
                  <Text className="text-xs font-medium">{tag.label}</Text>
                </Badge>
              ))
            ) : (
              <Text className="text-xs font-semibold mx-auto opacity-70">
                No tags found
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
