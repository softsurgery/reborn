import React from "react";
import { router } from "expo-router";
import {
  Bookmark,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  Star,
  GripVertical,
  MinusCircle,
  PlusCircle,
} from "lucide-react-native";
import { Pressable, View, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useRTL } from "@/hooks/useRTL";
import { useQuickActionsStore } from "@/hooks/stores/useQuickActionsStore";

interface QuickActionsProps {
  className?: string;
}

export const QuickActions = ({ className }: QuickActionsProps) => {
  const { palette } = useColorPalette();
  const isRTL = useRTL();
  const { t } = useTranslation("home");
  const store = useQuickActionsStore();

  const masterList = [
    {
      id: "work",
      title: t("quickActions.items.work.title"),
      icon: BriefcaseBusiness,
      description: t("quickActions.items.work.description"),
      onPress: () => router.push("/main/my-space/quick-actions/work"),
    },
    {
      id: "myJobs",
      title: t("quickActions.items.myJobs.title"),
      icon: BriefcaseBusiness,
      description: t("quickActions.items.myJobs.description"),
      onPress: () => router.push("/main/my-space/quick-actions/jobs"),
    },
    {
      id: "requests",
      title: t("quickActions.items.requests.title"),
      icon: Inbox,
      description: t("quickActions.items.requests.description"),
      onPress: () => router.push("/main/my-space/requests"),
    },
    {
      id: "savedJobs",
      title: t("quickActions.items.savedJobs.title"),
      icon: Bookmark,
      description: t("quickActions.items.savedJobs.description"),
      onPress: () => router.push("/main/my-space/quick-actions/saved"),
    },
    {
      id: "reviews",
      title: t("quickActions.items.reviews.title"),
      icon: Star,
      description: t("quickActions.items.reviews.description"),
      onPress: () => {},
      disabled: true,
    },
    {
      id: "viewed",
      title: t("quickActions.items.viewed.title"),
      icon: Eye,
      description: t("quickActions.items.viewed.description"),
      onPress: () => router.push("/main/my-space/quick-actions/viewed"),
    },
  ];

  // Map the ordered IDs to their full data objects
  const activeItems = store.activeIds
    .map((id) => masterList.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const inactiveItems = masterList.filter(
    (item) => !store.activeIds.includes(item.id),
  );

  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<any>) => {
    const isLast = getIndex() === activeItems.length - 1;
    const isDisabled = !!item.disabled && !store.isEditMode;

    return (
      <View>
        <Pressable
          className={cn(
            "w-full py-3 rounded-xl",
            isDisabled && "opacity-60",
            isActive && "bg-muted/50",
          )}
          onPress={
            store.isEditMode ? undefined : isDisabled ? undefined : item.onPress
          }
          onLongPress={store.isEditMode ? drag : undefined}
          disabled={store.isEditMode ? false : isDisabled}
        >
          <View
            className={cn(
              "flex-row items-center justify-between",
              isRTL && "flex-row-reverse",
            )}
          >
            <View
              className={cn(
                "flex-row items-center gap-3 flex-1",
                isRTL && "flex-row-reverse",
              )}
            >
              {store.isEditMode && (
                <TouchableOpacity
                  className="p-1 mr-1"
                  onPress={() => store.removeAction(item.id)}
                >
                  <Icon
                    as={MinusCircle}
                    size={20}
                    className="text-destructive"
                  />
                </TouchableOpacity>
              )}

              <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Icon
                  as={item.icon}
                  size={24}
                  color={palette.primaryForeground}
                />
              </View>

              <View className="flex-1">
                <Text className="text-base font-semibold">{item.title}</Text>
                <Text className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              {store.isEditMode ? (
                <TouchableOpacity onPressIn={drag} className="p-2">
                  <Icon
                    as={GripVertical}
                    size={20}
                    className="text-muted-foreground"
                  />
                </TouchableOpacity>
              ) : isDisabled ? (
                <Badge variant="outline">
                  <Text>{t("quickActions.soon")}</Text>
                </Badge>
              ) : (
                <Icon
                  as={isRTL ? ChevronLeft : ChevronRight}
                  size={18}
                  className="text-muted-foreground"
                />
              )}
            </View>
          </View>
        </Pressable>

        {!isLast && !isActive ? <Separator /> : null}
      </View>
    );
  };

  return (
    <View className={cn("gap-4", className)}>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold">Quick Actions</Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => store.setEditMode(!store.isEditMode)}
          >
            <View className="flex-row gap-1.5 px-2">
              <Text className="text-sm font-bold text-primary">
                {store.isEditMode ? "Done" : "Edit"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="w-full">
        {activeItems.length === 0 ? (
          <View className="items-center justify-center p-8 border border-dashed border-border rounded-xl">
            <Text className="text-muted-foreground text-sm text-center">
              No quick actions added. Tap "Edit" then "Add" to add some!
            </Text>
          </View>
        ) : (
          <DraggableFlatList
            data={activeItems}
            onDragEnd={({ data }) =>
              store.reorderActions(data.map((d) => d.id))
            }
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={
              !store.isEditMode || inactiveItems.length === 0
                ? { paddingBottom: 20 }
                : undefined
            }
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        )}

        {store.isEditMode && inactiveItems.length > 0 && (
          <View style={{ paddingBottom: 20 }}>
            {activeItems.length > 0 && <Separator className="my-2" />}
            {inactiveItems.map((item, index) => {
              const isLast = index === inactiveItems.length - 1;
              return (
                <View key={item.id}>
                  <View className="w-full py-3 rounded-xl opacity-60">
                    <View
                      className={cn(
                        "flex-row items-center justify-between",
                        isRTL && "flex-row-reverse",
                      )}
                    >
                      <View
                        className={cn(
                          "flex-row items-center gap-3 flex-1",
                          isRTL && "flex-row-reverse",
                        )}
                      >
                        <TouchableOpacity
                          className="p-1 mr-1"
                          onPress={() => store.addAction(item.id)}
                        >
                          <Icon
                            as={PlusCircle}
                            size={20}
                            className="text-primary"
                          />
                        </TouchableOpacity>

                        <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary">
                          <Icon
                            as={item.icon}
                            size={24}
                            color={palette.primaryForeground}
                          />
                        </View>

                        <View className="flex-1">
                          <Text className="text-base font-semibold">
                            {item.title}
                          </Text>
                          <Text className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {!isLast && <Separator />}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};
