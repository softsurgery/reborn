import React from "react";
import {
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  View,
  NativeScrollEvent,
  Pressable,
} from "react-native";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useColorPalette } from "@/hooks/useColorPalette";
import { hslToHex } from "@/lib/theme";
import { useRTL } from "@/hooks/useRTL";
import { router } from "expo-router";
import { Briefcase, GraduationCap, Pen, Plus, Tag } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ExperienceInstance } from "../forms/experience/ExperienceInstance";
import { EducationInstance } from "../forms/education/EducationInstance";
import {
  ResponseExperienceDto,
  ResponseEducationDto,
  ResponseRefParamDto,
} from "@/types";

interface CarreerTabProps {
  className?: string;
  userId?: string;
  editable?: boolean;
  experiences?: ResponseExperienceDto[];
  educations?: ResponseEducationDto[];
  skills?: ResponseRefParamDto[];
  userSkills?: number[];
  onRefresh?: () => void;
  refreshing?: boolean;
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollRef?: React.RefObject<any>;
}

export const CareerTab = ({
  className,
  userId,
  editable,
  experiences,
  educations,
  skills,
  userSkills,
  onRefresh,
  refreshing,
  onScroll,
  scrollRef,
}: CarreerTabProps) => {
  const { t } = useTranslation("menu");
  const { palette } = useColorPalette();
  const primary = hslToHex(palette.primary);
  const isRTL = useRTL();

  const activeSkills = skills?.filter((skill) =>
    userSkills?.includes(skill.id),
  );

  return (
    <ScrollView
      ref={scrollRef}
      onScroll={onScroll}
      className={cn("flex-1 bg-background", className)}
      contentContainerStyle={{ paddingTop: 20, paddingBottom: 32 }}
      refreshControl={
        <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex flex-col gap-6">
        {/* EXPERIENCE SECTION */}
        <View className="px-4">
          <View
            className={cn(
              "items-center justify-between",
              isRTL ? "flex-row-reverse" : "flex-row",
            )}
          >
            <View
              className={cn(
                "items-center gap-2",
                isRTL ? "flex-row-reverse" : "flex-row",
              )}
            >
              <Icon as={Briefcase} size={18} color={primary} />
              <Text className="text-base font-bold text-foreground">
                {t("menu.tabs.career.experience.title")}
              </Text>
              {experiences && (
                <View className="items-center rounded-full px-1.5 py-0.5 bg-primary/10">
                  <Text className="text-sm font-bold">
                    {experiences?.length}
                  </Text>
                </View>
              )}
            </View>
            {editable && (
              <View
                className={cn(
                  "items-center gap-1.5",
                  isRTL ? "flex-row-reverse" : "flex-row",
                )}
              >
                <Pressable
                  className="h-9 w-9 items-center justify-center rounded-full border border-border active:bg-primary/15"
                  onPress={() =>
                    router.push("/main/account/career/create-experience")
                  }
                >
                  <Icon as={Plus} size={18} color={primary} />
                </Pressable>
                <Pressable
                  className="h-9 w-9 items-center justify-center rounded-full border border-border active:bg-primary/15"
                  onPress={() =>
                    router.push("/main/account/career/update-experiences")
                  }
                >
                  <Icon as={Pen} size={16} color={primary} />
                </Pressable>
              </View>
            )}
          </View>
          <View className="pt-3">
            {experiences?.length === 0 ? (
              <View className="items-center rounded-2xl border border-dashed border-border py-6">
                <Text className="text-sm italic text-muted-foreground">
                  {t("experience.list.empty.title")}
                </Text>
              </View>
            ) : (
              <View>
                {experiences?.map((exp, idx) => (
                  <View key={idx} className="my-4">
                    <ExperienceInstance experience={exp} />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* EDUCATION SECTION */}
        <View className="px-4">
          <View
            className={cn(
              "items-center justify-between",
              isRTL ? "flex-row-reverse" : "flex-row",
            )}
          >
            <View
              className={cn(
                "items-center gap-2",
                isRTL ? "flex-row-reverse" : "flex-row",
              )}
            >
              <Icon as={GraduationCap} size={18} color={primary} />
              <Text className="text-base font-bold text-foreground">
                {t("menu.tabs.career.education.title")}
              </Text>
              {educations && (
                <View className="items-center rounded-full px-1.5 py-0.5 bg-primary/10">
                  <Text className="text-sm font-bold">
                    {educations?.length}
                  </Text>
                </View>
              )}
            </View>
            {editable && (
              <View
                className={cn(
                  "items-center gap-1.5",
                  isRTL ? "flex-row-reverse" : "flex-row",
                )}
              >
                <Pressable
                  className="h-9 w-9 items-center justify-center rounded-full border border-border active:bg-primary/15"
                  onPress={() =>
                    router.push("/main/account/career/create-education")
                  }
                >
                  <Icon as={Plus} size={18} color={primary} />
                </Pressable>
                <Pressable
                  className="h-9 w-9 items-center justify-center rounded-full border border-border active:bg-primary/15"
                  onPress={() =>
                    router.push("/main/account/career/update-educations")
                  }
                >
                  <Icon as={Pen} size={16} color={primary} />
                </Pressable>
              </View>
            )}
          </View>
          <View className="pt-3">
            {educations?.length ? (
              <View>
                {educations.map((edu, idx) => (
                  <View key={idx} className="my-4">
                    <EducationInstance education={edu} />
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center rounded-2xl border border-dashed border-border py-6">
                <Text className="text-sm italic text-muted-foreground">
                  {t("education.list.empty.title")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* SKILLS SECTION */}
        <View className="px-4">
          <View
            className={cn(
              "items-center justify-between",
              isRTL ? "flex-row-reverse" : "flex-row",
            )}
          >
            <View
              className={cn(
                "items-center gap-2",
                isRTL ? "flex-row-reverse" : "flex-row",
              )}
            >
              <Icon as={Tag} size={18} color={primary} />
              <Text className="text-base font-bold text-foreground">
                {t("menu.skills.title")}
              </Text>
              {activeSkills && (
                <View className="items-center rounded-full px-1.5 py-0.5 bg-primary/10">
                  <Text className="text-sm font-bold">
                    {activeSkills.length}
                  </Text>
                </View>
              )}
            </View>
            {editable && (
              <View
                className={cn(
                  "items-center gap-1.5",
                  isRTL ? "flex-row-reverse" : "flex-row",
                )}
              >
                <Pressable
                  className="h-9 w-9 items-center justify-center rounded-full border border-border active:bg-primary/15"
                  onPress={() =>
                    router.push(
                      userId
                        ? {
                            pathname: "/main/account/update-skills",
                            params: { userId },
                          }
                        : "/main/account/update-skills",
                    )
                  }
                >
                  <Icon as={Pen} size={16} color={primary} />
                </Pressable>
              </View>
            )}
          </View>
          <View className="pt-3">
            {!activeSkills ? (
              <View className="items-center rounded-2xl border border-dashed border-border py-6">
                <Text className="text-sm italic text-muted-foreground">
                  {t("menu.skills.list.empty.title")}
                </Text>
              </View>
            ) : (
              <View
                className={cn(
                  "flex-wrap gap-2",
                  isRTL ? "flex-row-reverse" : "flex-row",
                )}
              >
                {activeSkills.map((skill, idx) => (
                  <View
                    key={idx}
                    className="rounded-full border border-border px-3 py-1.5"
                  >
                    <Text className="text-sm font-semibold">{skill.label}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
