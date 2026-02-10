import React from "react";
import { View, TouchableOpacity, Dimensions, Modal } from "react-native";
import { X } from "lucide-react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";
import { THEME } from "~/lib/theme";
import { Text } from "~/components/ui/text";

interface ImageCarouselModalProps {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  title?: string;
}

export const ImageCarouselModal = ({
  visible,
  images,
  initialIndex = 0,
  onClose,
  title,
}: ImageCarouselModalProps) => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { colorScheme } = useColorScheme();

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  React.useEffect(() => {
    if (visible && ref.current && initialIndex > 0) {
      ref.current.scrollTo({
        count: initialIndex,
        animated: false,
      });
    }
  }, [visible, initialIndex]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/90">
        {/* Header with close button and title */}
        <View className="flex-row justify-between items-center px-4 py-4 pt-12">
          {title && (
            <Text className="text-lg font-semibold flex-1">{title}</Text>
          )}
          <TouchableOpacity onPress={onClose} className="ml-auto">
            <X size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Image Carousel */}
        <View className="flex-1 justify-center">
          <Carousel
            ref={ref}
            width={width}
            height={height * 0.7}
            data={images}
            onProgressChange={progress}
            renderItem={({ item: imageUrl }) => (
              <View className="justify-center items-center">
                <Image
                  source={{ uri: imageUrl }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="contain"
                />
              </View>
            )}
          />
        </View>

        {/* Pagination dots */}
        {images.length > 1 && (
          <View className="flex-row justify-center py-4">
            <Pagination.Basic
              progress={progress}
              data={images}
              dotStyle={{
                backgroundColor:
                  colorScheme === "dark"
                    ? THEME.dark.primary
                    : THEME.light.primary,
                borderRadius: 50,
                width: 8,
                height: 8,
              }}
              containerStyle={{ gap: 8 }}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};
