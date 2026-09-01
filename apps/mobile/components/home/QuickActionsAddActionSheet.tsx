import React, { forwardRef, useMemo } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { PlusCircle } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { getQuickActionsMasterList } from "./QuickActions";
import { useQuickActionsStore } from "@/hooks/stores/useQuickActionsStore";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import { useColorPalette } from "@/hooks/useColorPalette";
import { hslToHex } from "@/lib/theme";

interface QuickActionsAddActionSheetProps {
  className?: string;
}

export const QuickActionsAddActionSheet = forwardRef<ActionSheetRef, QuickActionsAddActionSheetProps>(
  ({ className }, ref) => {
    const { t } = useTranslation("home");
    const store = useQuickActionsStore();
    const insets = useSafeAreaInsets();
    const { palette } = useColorPalette();
    
    const innerRef = React.useRef<ActionSheetRef>(null);
    React.useImperativeHandle(ref, () => innerRef.current as ActionSheetRef);

    const masterList = useMemo(() => getQuickActionsMasterList(t), [t]);

    const availableItems = masterList.filter(
      (item) => !store.activeIds.includes(item.id)
    );

    return (
      <ActionSheet 
        ref={innerRef}
        gestureEnabled
        indicatorStyle={{
          width: 40,
          marginTop: 10,
          backgroundColor: hslToHex(palette.mutedForeground),
        }}
        containerStyle={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: hslToHex(palette.background),
        }}
      >
        <View 
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
          className={cn("px-4 pt-6 flex flex-col", className)}
        >
          <Text className="text-xl font-bold mb-4">Add Quick Action</Text>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {availableItems.length === 0 ? (
              <View className="items-center justify-center py-8">
                <Text className="text-muted-foreground text-center">
                  All available quick actions have been added.
                </Text>
              </View>
            ) : (
              availableItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="flex-row items-center justify-between p-4 mb-2 bg-card border border-border/50 rounded-xl active:opacity-50"
                  onPress={() => {
                    store.addAction(item.id);
                    if (availableItems.length === 1) {
                      // @ts-ignore
                      ref?.current?.hide();
                    }
                  }}
                >
                  <View className="flex-row items-center gap-3 flex-1 mr-4">
                    <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon as={item.icon} size={24} className="text-primary" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold">{item.title}</Text>
                      <Text className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  <Icon as={PlusCircle} size={24} className="text-primary" />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </ActionSheet>
    );
  }
);
QuickActionsAddActionSheet.displayName = "QuickActionsAddActionSheet";
