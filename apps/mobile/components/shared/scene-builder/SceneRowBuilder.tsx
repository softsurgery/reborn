import React from "react";
import { View } from "react-native";
import { StablePressable } from "../StablePressable";
import { Text } from "~/components/ui/text";
import { DynamicSceneRow, DynamicSceneRowVariant } from "./types";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Icon } from "~/components/ui/icon";
import { ArrowRight, ChevronRight } from "lucide-react-native";
import { cn } from "~/lib/utils";

interface SceneRowBuilderProps {
  className?: string;
  row: DynamicSceneRow;
}

export const SceneRowBuilder = ({ className, row }: SceneRowBuilderProps) => {
  const renderVariant = () => {
    switch (row.variant) {
      case DynamicSceneRowVariant.TAPPABLE:
        return <Icon as={ChevronRight} size={20} color={"gray"} />;

      case DynamicSceneRowVariant.NON_TAPPABLE:
        return <Text className="text-xs opacity-80">{row.props?.text}</Text>;

      case DynamicSceneRowVariant.SWITCH:
        return (
          <Switch
            checked={row.props?.checked}
            onCheckedChange={(value) => {
              alert(value ? "true" : "false");
            }}
          />
        );

      case DynamicSceneRowVariant.CUSTOM:
        return <Text className="text-xs opacity-80">[Custom]</Text>;

      default:
        return null;
    }
  };

  return (
    <>
      <StablePressable
        className={cn(
          "flex flex-row justify-between items-center bg-card p-3.5 rounded-none",
          className
        )}
      >
        <View className="flex-1">
          <Text className="text-sm text-muted-foreground">{row.label}</Text>
          {row.description ? (
            <Text className="text-xs opacity-60">{row.description}</Text>
          ) : null}
        </View>

        {/* Variant Output */}
        <View>{renderVariant()}</View>
      </StablePressable>

      <Separator />
    </>
  );
};
