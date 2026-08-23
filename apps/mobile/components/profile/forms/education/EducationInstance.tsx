import { SeeMoreText } from "@/components/shared/SeeMoreText";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { hslToHex } from "@/lib/theme";
import { ResponseEducationDto } from "@/types";
import { format } from "date-fns";
import { CalendarDays, GraduationCap } from "lucide-react-native";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useRTL } from "@/hooks/useRTL";

interface EducationInstanceProps {
  className?: string;
  education: ResponseEducationDto;
}

export const EducationInstance = ({
  className,
  education,
}: EducationInstanceProps) => {
  const { t } = useTranslation("menu");
  const { palette } = useColorPalette();
  const isRTL = useRTL();
  const primary = hslToHex(palette.primary);

  const range = education.startDate
    ? `${format(new Date(education.startDate), "yyyy")} — ${
        education.endDate
          ? format(new Date(education.endDate), "yyyy")
          : t("education.instance.present")
      }`
    : null;

  return (
    <View
      className={cn(
        "gap-3",
        isRTL ? "flex-row-reverse" : "flex-row",
        education.description ? "items-start" : "items-center",
        className,
      )}
    >
      {/* School tile */}
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary/50">
        <Icon as={GraduationCap} size={20} color={"white"} />
      </View>

      <View className="flex-1">
        <Text className="text-[15px] font-bold text-foreground">
          {education.title}
        </Text>
        {!!education.institution && (
          <Text className="mt-0.5 text-sm font-semibold text-muted-foreground">
            {education.institution}
          </Text>
        )}

        {range && (
          <View className={cn("mt-2", isRTL ? "flex-row-reverse" : "flex-row")}>
            <View
              className={cn(
                "items-center gap-1 rounded-full bg-muted px-2.5 py-1",
                isRTL ? "flex-row-reverse" : "flex-row",
              )}
            >
              <Icon as={CalendarDays} size={12} color={primary} />
              <Text className="text-[11px] font-medium text-muted-foreground">
                {range}
              </Text>
            </View>
          </View>
        )}

        {!!education.description && (
          <SeeMoreText
            className="mt-2.5"
            textClassname="text-sm leading-5 text-muted-foreground"
            numberOfLines={2}
          >
            {education.description}
          </SeeMoreText>
        )}
      </View>
    </View>
  );
};
