import {
  CheckCircle,
  Clock,
  FileText,
  Heart,
  Star,
  Wallet,
} from "lucide-react-native";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { timeAgo } from "~/lib/dates.utils";
import { cn } from "~/lib/utils";
import { ResponseJobDto, ResponseJobMetadataDto } from "~/types";

import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import { UseQueryResult } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";
import { THEME } from "~/lib/theme";

interface JobCardHeaderProps {
  className?: string;
  job: ResponseJobDto | null;
  handleSave: (e: any) => void;
  isSavePending: boolean;
  isJobSaved: boolean;
  metadata: ResponseJobMetadataDto | null;
  uploads: string[];
  imageQueries: UseQueryResult<string, Error>[];
}

export const JobCardHeader = ({
  className,
  job,
  metadata,
  handleSave,
  isSavePending,
  isJobSaved,
  uploads,
  imageQueries,
}: JobCardHeaderProps) => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { colorScheme } = useColorScheme();

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height * 0.3;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View
      className={cn("bg-muted px-6 pb-5 border-b border-border", className)}
    >
      <View className="flex flex-col items-center mb-4">
        <Carousel
          ref={ref}
          width={width}
          height={height}
          data={uploads}
          onProgressChange={progress}
          autoPlay
          autoPlayInterval={3000}
          renderItem={({ index }) => {
            const query = imageQueries[index];

            if (!query?.data) {
              return (
                <View className="justify-center items-center">
                  <Text>Loading...</Text>
                </View>
              );
            }

            return (
              <View className="justify-center items-center">
                <Image
                  source={{ uri: query.data }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="cover"
                />
              </View>
            );
          }}
        />
        <Pagination.Basic
          progress={progress}
          data={uploads}
          dotStyle={{
            backgroundColor:
              colorScheme == "dark" ? THEME.dark.primary : THEME.light.primary,
            borderRadius: 50,
          }}
          containerStyle={{ gap: 5, marginTop: -20 }}
          onPress={onPressPagination}
        />
      </View>
      <View className="flex-row items-center justify-between mt-3">
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
        <TouchableOpacity onPress={handleSave} disabled={isSavePending}>
          {isSavePending ? (
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

      <View className="flex flex-row items-center gap-3 mt-2">
        <View className="flex-row items-center gap-1 flex-1">
          <FileText size={14} color="#6366f1" />
          <Text className="text-xs text-card-foreground">
            {metadata?.requestCount} proposals
          </Text>
        </View>
        <View className="flex-row items-center gap-1 flex-1">
          <CheckCircle size={14} color="#16a34a" />
          <Text className="text-xs text-card-foreground">Payment verified</Text>
        </View>
        <View className="flex-row items-center gap-1 flex-1">
          <Star size={14} color="#fbbf24" fill="#fbbf24" />
          <Text className="text-xs text-card-foreground">
            4.8 client rating
          </Text>
        </View>
      </View>
    </View>
  );
};
