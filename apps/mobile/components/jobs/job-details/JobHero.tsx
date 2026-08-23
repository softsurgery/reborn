import React from "react";
import { View } from "react-native";
import { ImageSource } from "expo-image";
import { UseQueryResult } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BadgeCheck, ShieldOff, Star, Users } from "lucide-react-native";
import { ImageCarousel } from "~/components/shared/image-carousel/ImageCarouselWithModal";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/stables/StableAvatar";
import { Text } from "~/components/ui/text";
import { useServerImages } from "~/hooks/content/useServerImages";
import { useColorPalette } from "@/hooks/useColorPalette";
import { timeAgo } from "~/lib/dates.utils";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import {
  JobPricingType,
  ResponseJobDto,
  ResponseJobMetadataDto,
} from "~/types";

interface JobHeroProps {
  className?: string;
  job: ResponseJobDto | null;
  metadata: ResponseJobMetadataDto | null;
  uploads: string[];
  imageQueries: UseQueryResult<ImageSource, Error>[];
}

interface CurrencyExtras {
  code?: string;
  digitsAfterComma?: number;
}

const Stat = ({
  icon,
  value,
  label,
  muted,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  muted?: boolean;
}) => (
  <View className="flex-1 items-center gap-1 px-1">
    {icon}
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      className={cn("text-sm font-semibold", muted && "text-muted-foreground")}
    >
      {value}
    </Text>
    <Text
      numberOfLines={1}
      style={{ fontSize: 10 }}
      className="uppercase tracking-wider text-muted-foreground"
    >
      {label}
    </Text>
  </View>
);

export const JobHero = ({
  className,
  job,
  metadata,
  uploads,
  imageQueries,
}: JobHeroProps) => {
  const { palette } = useColorPalette();
  const insets = useSafeAreaInsets();
  const hasImages = imageQueries.length > 0;

  const { uploads: [authorPicture] } = useServerImages({
    ids: [job?.postedBy?.pictureId],
    enabled: !!job?.postedBy?.pictureId,
  });

  // `label` is the currency's full name; the code and precision live in extras.
  const extras = (job?.currency?.extras ?? {}) as CurrencyExtras;
  const code = extras.code || job?.currency?.label || "";
  const digits = extras.digitsAfterComma ?? 2;
  const amount = Number.isFinite(job?.price) ? job!.price.toFixed(digits) : "—";
  const isHourly = job?.pricingType === JobPricingType.HOURLY;

  const paymentVerified = !!metadata?.paymentVerified;
  const hasReviews =
    !!metadata?.reviewCount && Number.isFinite(metadata.rating);

  return (
    <View
      style={{ paddingTop: hasImages ? 0 : insets.top + 48 }}
      className={cn("bg-card", className)}
    >
      {hasImages && (
        <ImageCarousel
          uploads={uploads}
          imageQueries={imageQueries}
          autoPlay={false}
          heightScale={0.35}
        />
      )}

      <View className="gap-3 px-5 pb-5 pt-5">
        <View className="gap-1">
          <Text
            numberOfLines={1}
            style={{ fontSize: 10 }}
            className="font-bold uppercase tracking-widest text-primary"
          >
            {job?.category?.label ?? "Uncategorised"}
          </Text>

          <Text variant="h3" numberOfLines={3} className="leading-8">
            {job?.title}
          </Text>
        </View>

        {/* Who posted it, and when */}
        <View className="flex-row items-center gap-2">
          <Avatar
            alt={identifyUser(job?.postedBy)}
            style={{ width: 22, height: 22 }}
          >
            <AvatarImage source={authorPicture as ImageSource} />
            <AvatarFallback>
              <Text style={{ fontSize: 9 }} className="font-semibold">
                {identifyUserAvatar(job?.postedBy)}
              </Text>
            </AvatarFallback>
          </Avatar>

          <Text numberOfLines={1} className="text-xs font-medium">
            {identifyUser(job?.postedBy)}
          </Text>
          <Text className="text-xs text-muted-foreground">
            · posted {timeAgo(job?.createdAt || new Date())}
          </Text>
        </View>

        {/* The pay is the decision this screen exists to support. */}
        <View className="mt-1 flex-row items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
          <View className="flex-row items-baseline gap-1.5">
            <Text className="text-3xl font-bold tracking-tight">{amount}</Text>
            <Text className="text-sm font-semibold text-muted-foreground">
              {code}
            </Text>
          </View>

          <View className="rounded-full bg-muted px-3 py-1.5">
            <Text
              style={{ fontSize: 11 }}
              className="font-semibold text-muted-foreground"
            >
              {isHourly ? "Per hour" : "Fixed price"}
            </Text>
          </View>
        </View>

        {/* What the numbers say before you commit */}
        <View className="mt-1 flex-row items-center rounded-2xl border border-border py-3">
          <Stat
            icon={<Users size={16} color={palette.mutedForeground} />}
            value={`${metadata?.requestCount ?? 0}`}
            label="Proposals"
          />

          <View className="h-8 w-px bg-border" />

          <Stat
            icon={
              paymentVerified ? (
                <BadgeCheck size={16} color={palette.primary} />
              ) : (
                <ShieldOff size={16} color={palette.mutedForeground} />
              )
            }
            value={paymentVerified ? "Verified" : "Unverified"}
            label="Payment"
            muted={!paymentVerified}
          />

          <View className="h-8 w-px bg-border" />

          <Stat
            icon={
              <Star
                size={16}
                color={hasReviews ? palette.primary : palette.mutedForeground}
                fill={hasReviews ? palette.primary : "none"}
              />
            }
            value={
              hasReviews
                ? `${metadata!.rating.toFixed(1)} (${metadata!.reviewCount})`
                : "—"
            }
            label="Rating"
            muted={!hasReviews}
          />
        </View>
      </View>
    </View>
  );
};
