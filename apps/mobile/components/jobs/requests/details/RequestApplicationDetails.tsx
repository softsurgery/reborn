import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { ResponseJobRequestDto } from "@/types";
import { cn } from "@/lib/utils";

interface RequestApplicationDetailsProps {
  className?: string;
  request: ResponseJobRequestDto;
}

export const RequestApplicationDetails = ({
  className,
  request,
}: RequestApplicationDetailsProps) => {
  if (!request.message && !request.proposedPrice) {
    return null;
  }

  const originalPrice = request.job?.price;
  const proposedPrice = request.proposedPrice;
  const priceDiff =
    originalPrice && proposedPrice ? proposedPrice - originalPrice : null;

  // extras might contain symbol or code, and fallback to label
  const unit =
    request.job?.currency?.extras?.symbol ||
    request.job?.currency?.extras?.code ||
    request.job?.currency?.label ||
    "";

  return (
    <View className={cn(className)}>
      <Text className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
        Application Details
      </Text>
      <View className="flex flex-col border border-border/40 rounded-lg overflow-hidden">
        {request.proposedPrice && (
          <>
            <View className="flex flex-row items-center justify-between p-3 border-b border-border/40 bg-muted/20">
              <Text className="text-sm font-semibold text-muted-foreground">
                Original Price
              </Text>
              <Text className="text-sm font-bold text-foreground">
                {originalPrice !== undefined ? `${originalPrice} ${unit}` : "-"}
              </Text>
            </View>
            <View className="flex flex-row items-center justify-between p-3 border-b border-border/40 bg-muted/20">
              <Text className="text-sm font-semibold text-muted-foreground">
                Proposed Price
              </Text>
              <View className="flex flex-row items-center gap-2">
                <Text className="text-sm font-bold">
                  {proposedPrice} {unit}
                </Text>
                {priceDiff !== null && priceDiff !== 0 && (
                  <Text
                    className={cn(
                      "text-sm font-bold",
                      priceDiff < 0 ? "text-rose-500" : "text-emerald-500",
                    )}
                  >
                    ({priceDiff > 0 ? "+" : ""}
                    {priceDiff} {unit})
                  </Text>
                )}
              </View>
            </View>
          </>
        )}

        {request.message && (
          <View className="flex flex-col gap-2 p-3 bg-muted/10">
            <Text className="text-sm font-semibold text-muted-foreground">
              Message
            </Text>
            <Text className="text-sm text-foreground leading-relaxed italic">
              "{request.message}"
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
