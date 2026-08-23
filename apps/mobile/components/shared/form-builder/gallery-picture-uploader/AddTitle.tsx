import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Plus } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface AddTileProps {
  itemSize: number;
  onPress: () => void;
  remaining: number;
}

export const AddTile = ({ itemSize, onPress, remaining }: AddTileProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: itemSize, height: itemSize }}
      className="rounded-2xl border-2 border-dashed border-muted-foreground/40 items-center justify-center gap-1 bg-muted/30"
    >
      <View className="bg-muted rounded-full p-2.5">
        <Icon as={Plus} size={22} className="text-muted-foreground" />
      </View>
      <Text className="text-muted-foreground text-sm mt-1">
        {remaining} left
      </Text>
    </Pressable>
  );
};
