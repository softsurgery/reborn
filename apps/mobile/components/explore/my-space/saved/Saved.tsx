import React from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import Icon from "~/lib/Icon";
import { SavedList } from "./SavedList";

type TabType = "incoming" | "outgoing";

interface SavedProps {
  className?: string;
}

export const Saved = ({ className }: SavedProps) => {
  const [search, setSearch] = React.useState("");

  return (
    <View className={cn("flex flex-1", className)}>
      <View className="flex-1 mx-4">
        <SavedList search="" searching={false} />
      </View>
    </View>
  );
};
