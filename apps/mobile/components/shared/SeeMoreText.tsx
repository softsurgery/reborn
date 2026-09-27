import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "../ui/text";
import { useRTL } from "@/hooks/useRTL";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface SeeMoreTextProps {
  children: string;
  className?: string;
  numberOfLines?: number;
  textClassname?: string;
  pressableClassname?: string;
}

export const SeeMoreText = ({
  children,
  numberOfLines = 2,
  className,
  textClassname,
  pressableClassname,
}: SeeMoreTextProps) => {
  const [expanded, setExpanded] = React.useState(false);
  const [showButton, setShowButton] = React.useState(false);
  const [measured, setMeasured] = React.useState(false);
  const isRTL = useRTL();
  const { t } = useTranslation();

  return (
    <View className={className}>
      <Text
        className={textClassname}
        numberOfLines={measured && !expanded ? numberOfLines : undefined}
        onTextLayout={(e) => {
          if (measured) return;
          if (e.nativeEvent.lines.length > numberOfLines) {
            setShowButton(true);
          }
          setMeasured(true);
        }}
        style={{ opacity: measured ? 1 : 0 }}
      >
        {children}
      </Text>
      {showButton && (
        <Pressable
          className={cn(
            isRTL ? "items-end" : "items-start",
            pressableClassname,
          )}
          onPress={() => setExpanded(!expanded)}
        >
          <Text className="text-primary text-sm font-medium pt-1">
            {expanded ? t("see_less") : t("see_more")}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
