import { router } from "expo-router";
import React from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Eye,
  Hammer,
  Inbox,
  Star,
  GripVertical,
  MinusCircle,
  PlusCircle,
  Settings2,
} from "lucide-react-native";
import { Pressable, View, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
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
import {
  useQuickActionsStore,
  QuickActionId,
} from "@/hooks/stores/useQuickActionsStore";
import { QuickActionsAddActionSheet } from "./QuickActionsAddActionSheet";
import { ActionSheetRef } from "react-native-actions-sheet";

interface QuickActionsProps {
  className?: string;
}

// Master list of all possible quick actions
export const getQuickActionsMasterList = (t: any) => [
  {
    id: "myJobs" as QuickActionId,
    title: t("quickActions.items.myJobs.title"),
    icon: BriefcaseBusiness,
    description: t("quickActions.items.myJobs.description"),
    onPress: () => router.push("/main/my-space/quick-actions/jobs"),
  },
  {
    id: "requests" as QuickActionId,
    title: t("quickActions.items.requests.title"),
    icon: Inbox,
    description: t("quickActions.items.requests.description"),
    onPress: () => router.push("/main/my-space/requests"),
  },
  {
    id: "savedJobs" as QuickActionId,
    title: t("quickActions.items.savedJobs.title"),
    icon: Bookmark,
    description: t("quickActions.items.savedJobs.description"),
    onPress: () => router.push("/main/my-space/quick-actions/saved"),
  },
  {
    id: "reviews" as QuickActionId,
    title: t("quickActions.items.reviews.title"),
    icon: Star,
    description: t("quickActions.items.reviews.description"),
    onPress: () => {},
    disabled: true,
  },
  {
    id: "viewed" as QuickActionId,
    title: t("quickActions.items.viewed.title"),
    icon: Eye,
    description: t("quickActions.items.viewed.description"),
    onPress: () => router.push("/main/my-space/quick-actions/viewed"),
  },
];

export const QuickActions = ({ className }: QuickActionsProps) => {
  const { palette } = useColorPalette();
  const isRTL = useRTL();
  const { t } = useTranslation("home");
  const store = useQuickActionsStore();
  const addSheetRef = React.useRef<ActionSheetRef>(null);

  const masterList = getQuickActionsMasterList(t);

  // Map the ordered IDs to their full data objects
  const activeItems = store.activeIds
    .map((id) => masterList.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<any>) => {
    const isLast = getIndex() === activeItems.length - 1;
    const isDisabled = !!item.disabled && !store.isEditMode;

    return (
      <ScaleDecorator>
        <View>
          <Pressable
            className={cn(
              "w-full py-3 rounded-xl",
              isDisabled && "opacity-60",
              isActive && "bg-muted/50",
            )}
            onPress={
              store.isEditMode
                ? undefined
                : isDisabled
                  ? undefined
                  : item.onPress
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
      </ScaleDecorator>
    );
  };

  return (
    <View className={cn("gap-4", className)}>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold">Quick Actions</Text>
        <View className="flex-row items-center gap-2">
          {store.isEditMode && (
            <TouchableOpacity onPress={() => addSheetRef.current?.show()}>
              <View className="flex-row items-center justify-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                <Icon as={PlusCircle} size={16} className="text-primary" />
                <Text className="text-primary text-sm font-bold">Add</Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => store.setEditMode(!store.isEditMode)}
          >
            <View className="flex-row gap-1.5 px-2">
              <Icon as={Settings2} size={16} color={palette.primary} />
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
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        )}
      </View>

      <QuickActionsAddActionSheet ref={addSheetRef} />
    </View>
  );
};
