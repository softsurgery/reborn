import React from "react";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Heart,
} from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import { timeAgo } from "~/lib/dates.utils";
import { cn } from "~/lib/utils";
import { ResponseJobDto, ResponseJobMetadataDto } from "~/types";
import { UseQueryResult } from "@tanstack/react-query";
import { ImageCarousel } from "~/components/shared/image-carousel/ImageCarouselWithModal";
import { Icon } from "~/components/ui/icon";
import { router } from "expo-router";

interface JobCardHeaderProps {
  className?: string;
  job: ResponseJobDto | null;
  isSavePending: boolean;
  isJobSaved: boolean;
  metadata: ResponseJobMetadataDto | null;
  uploads: string[];
  imageQueries: UseQueryResult<string, Error>[];
  handleSave: () => void;
}

export const JobCardHeader = ({
  className,
  job,
  metadata,
  isSavePending,
  isJobSaved,
  uploads,
  imageQueries,
  handleSave,
}: JobCardHeaderProps) => {
  const priceLabel = React.useMemo(() => {
    if (!job) return "—";

    const digitsAfterComma = (job.currency?.extras as any)?.digitsAfterComma;
    const safeDigits =
      typeof digitsAfterComma === "number" && digitsAfterComma >= 0
        ? digitsAfterComma
        : 3;

    const amount = Number.isFinite(job.price)
      ? job.price.toFixed(safeDigits)
      : "—";

    const currencyCode =
      (job.currency?.extras as any)?.code ?? job.currency?.label ?? "";

    return currencyCode ? `${amount} ${currencyCode}` : amount;
  }, [job]);

  const requestCountLabel =
    metadata && Number.isFinite(metadata.requestCount)
      ? `${metadata.requestCount} proposals`
      : "— proposals";

  const paymentLabel =
    metadata == null
      ? "Payment status —"
      : metadata.paymentVerified
        ? "Payment verified"
        : "Payment not verified";

  const ratingLabel =
    metadata && Number.isFinite(metadata.rating)
      ? `${metadata.rating.toFixed(1)}${
          metadata.reviewCount ? ` (${metadata.reviewCount})` : ""
        }`
      : "—";

  return (
    <View className={cn("bg-card px-6 pb-5 border-b border-border", className)}>
      {imageQueries.length > 0 && (
        <View className="flex flex-col items-center">
          <ImageCarousel
            uploads={uploads}
            imageQueries={imageQueries}
            autoPlay={false}
            heightScale={0.3}
            extraActions={[
              {
                icon: <Icon as={ArrowLeft} size={24} color="white" />,
                onPress: () => router.back(),
              },
            ]}
          />
        </View>
      )}

      <View className="flex-row items-start justify-between mt-6">
        <View className="flex-row items-start flex-1 pr-3">
          {imageQueries.length === 0 ? (
            <StablePressable
              className="p-2 -ml-2 mr-1 rounded-full"
              onPress={() => router.back()}
              onPressClassname="bg-muted/40"
            >
              <Icon as={ArrowLeft} size={22} />
            </StablePressable>
          ) : null}

          <View className="flex-1">
            <Text variant={"h3"} numberOfLines={2}>
              {job?.title}
            </Text>
          </View>
        </View>

        <StablePressable
          className={cn(
            "p-2 -mr-2 rounded-full",
            isSavePending && "opacity-50",
          )}
          onPress={handleSave}
          onPressClassname="bg-muted/40"
          disabled={isSavePending}
        >
          <Icon
            as={Heart}
            size={22}
            className={cn(
              isJobSaved ? "text-primary" : "text-muted-foreground",
            )}
            fill={isJobSaved ? "currentColor" : "none"}
          />
        </StablePressable>
      </View>

      <View className="flex flex-row flex-wrap items-center justify-between gap-2 mt-4">
        {/* proposals */}
        <TouchableOpacity className="flex-row items-center gap-1 pl-2">
          <Icon as={FileText} size={18} color={"purple"} />
          <Text className="text-sm text-muted-foreground">
            {requestCountLabel}
          </Text>
        </TouchableOpacity>
        {/* verified payment */}
        <TouchableOpacity className="flex-row items-center gap-1 pl-2">
          <Icon
            as={CheckCircle}
            size={18}
            color={metadata?.paymentVerified ? "emerald" : "gray"}
          />
          <Text className="text-sm text-muted-foreground">{paymentLabel}</Text>
        </TouchableOpacity>
        {/* created at and price */}
        <TouchableOpacity className="flex-row items-center gap-1 pl-2">
          <Icon as={Clock} size={16} className="text-muted-foreground" />
          <Text className="text-sm text-muted-foreground">
            {timeAgo(job?.createdAt || new Date())}
          </Text>
        </TouchableOpacity>
        {/* price */}
        <TouchableOpacity className="flex-row items-center gap-1 pl-2">
          <Icon as={DollarSign} size={16} color={"green"} />
          <Text className="text-sm text-muted-foreground">{priceLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
