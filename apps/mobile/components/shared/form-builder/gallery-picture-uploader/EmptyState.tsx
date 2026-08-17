import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ImageIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface EmptyStateProps {
  onPress: () => void;
  maxImages: number;
}

export const EmptyState = ({ onPress, maxImages }: EmptyStateProps) => (
  <Pressable
    onPress={onPress}
    className="w-full py-10 rounded-2xl border-2 border-dashed border-muted-foreground/40 items-center justify-center bg-muted/20"
  >
    <View className="bg-muted rounded-full p-4 mb-3">
      <Icon as={ImageIcon} size={28} className="text-muted-foreground" />
    </View>
    <Text className="text-foreground text-sm font-poppins-semibold">
      Add Photos
    </Text>
    <Text className="text-muted-foreground text-xs mt-1">
      Tap to select up to {maxImages} images
    </Text>
  </Pressable>
);
