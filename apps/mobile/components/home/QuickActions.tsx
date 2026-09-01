import React from "react";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { router } from "expo-router";
import {
  Bookmark,
  BriefcaseBusiness,
  Eye,
  Inbox,
  Star,
} from "lucide-react-native";
import { View, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import { Separator } from "~/components/ui/separator";
import { QuickAction } from "./QuickAction";
import { QuickActionsSkeleton } from "./QuickActionsSkeleton";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useRTL } from "@/hooks/useRTL";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/api";

interface QuickActionsProps {
  className?: string;
}

export const QuickActions = ({ className }: QuickActionsProps) => {
  const { palette } = useColorPalette();
  const isRTL = useRTL();
  const { t } = useTranslation("home");
  const DEFAULT_ACTIVE_IDS: string[] = [
    "work",
    "myJobs",
    "requests",
    "savedJobs",
    "reviews",
    "viewed",
  ];

  const [activeIds, setActiveIds] =
    React.useState<string[]>(DEFAULT_ACTIVE_IDS);
  const [isEditMode, setEditMode] = React.useState(false);
  const [hasInitialized, setHasInitialized] = React.useState(false);

  const { data, isFetching } = useQuery({
    queryKey: ["quick-actions-config"],
    queryFn: () => api.client.getMobileAppSettings(),
    staleTime: 0,
    gcTime: 0,
  });

  React.useEffect(() => {
    if (data && data.params) {
      const param = data.params.find((p: any) => p.name === "quick-actions");
      if (param && param.value) {
        try {
          setActiveIds(JSON.parse(param.value));
        } catch (e) {}
      }
    }
    if (!isFetching) {
      setHasInitialized(true);
    }
  }, [data, isFetching]);

  const updateMutation = useMutation({
    mutationFn: (newOrder: string[]) => {
      return api.client.updateQuickActions(newOrder);
    },
  });

  const reorderActions = (newOrder: string[]) => {
    const previousOrder = activeIds;
    setActiveIds(newOrder);
    updateMutation.mutate(newOrder, {
      onError: () => setActiveIds(previousOrder),
    });
  };

  const addAction = (id: string) => {
    const previousOrder = activeIds;
    const newOrder = [...activeIds, id];
    setActiveIds(newOrder);
    updateMutation.mutate(newOrder, {
      onError: () => setActiveIds(previousOrder),
    });
  };

  const removeAction = (id: string) => {
    const previousOrder = activeIds;
    const newOrder = activeIds.filter((activeId) => activeId !== id);
    setActiveIds(newOrder);
    updateMutation.mutate(newOrder, {
      onError: () => setActiveIds(previousOrder),
    });
  };

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
  const activeItems = activeIds
    .map((id) => masterList.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const inactiveItems = masterList.filter(
    (item) => !activeIds.includes(item.id),
  );

  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<any>) => {
    const isLast = getIndex() === activeItems.length - 1;

    return (
      <QuickAction
        type="active"
        item={item}
        isActive={isActive}
        isEditMode={isEditMode}
        isLast={isLast}
        onRemove={removeAction}
        drag={drag}
      />
    );
  };

  if (isFetching || !hasInitialized) {
    return <QuickActionsSkeleton className={className} />;
  }

  return (
    <View className={cn("gap-4", className)}>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold">Quick Actions</Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => setEditMode(!isEditMode)}>
            <View className="flex-row gap-1.5 px-2">
              <Text className="text-base font-bold text-primary">
                {isEditMode ? "Done" : "Edit"}
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
        ) : isEditMode ? (
          <DraggableFlatList
            data={activeItems}
            onDragEnd={({ data }) => reorderActions(data.map((d) => d.id))}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={
              inactiveItems.length === 0 ? { paddingBottom: 20 } : undefined
            }
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        ) : (
          <View style={{ paddingBottom: 20 }}>
            {activeItems.map((item, index) => {
              const isLast = index === activeItems.length - 1;
              return (
                <QuickAction
                  key={item.id}
                  type="active"
                  item={item}
                  isActive={false}
                  isEditMode={isEditMode}
                  isLast={isLast}
                  onRemove={removeAction}
                />
              );
            })}
          </View>
        )}

        {isEditMode && inactiveItems.length > 0 && (
          <Animated.View
            key="inactive-list"
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            layout={Layout.springify()}
            style={{ paddingBottom: 20 }}
          >
            {activeItems.length > 0 && <Separator className="my-2" />}
            {inactiveItems.map((item, index) => {
              const isLast = index === inactiveItems.length - 1;
              return (
                <QuickAction
                  key={item.id}
                  type="inactive"
                  item={item}
                  isEditMode={isEditMode}
                  isLast={isLast}
                  onAdd={addAction}
                />
              );
            })}
          </Animated.View>
        )}
      </View>
    </View>
  );
};
