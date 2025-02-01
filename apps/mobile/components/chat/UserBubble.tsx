import { Image, Pressable } from "react-native";
import { Text } from "../ui/text";

interface UserBubbleProps {
  uid?: string;
  style?: Record<string, string>;
  label?: string;
  pictureUrl?: string;
  gender?: boolean;
}

const getChecksum = (uid?: string) => {
  return uid?.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
};

export const UserBubble = ({
  style,
  label,
  uid,
  pictureUrl,
  gender,
}: UserBubbleProps) => {
  console.log(uid);
  const checksum = getChecksum(uid);
  const imageIndex = (checksum || 0) % 2 === 0 ? 2 : 1;

  let imageSrc;
  if (gender) {
    // Male
    imageSrc =
      imageIndex === 1
        ? require("~/assets/images/male-user-1.png")
        : require("~/assets/images/male-user-2.png");
  } else {
    // Female
    imageSrc =
      imageIndex === 1
        ? require("~/assets/images/female-user-1.png")
        : require("~/assets/images/female-user-2.png");
  }

  return (
    <Pressable className="flex flex-col items-center gap-1">
      <Image
        style={{ ...style }}
        className="w-16 h-16 shadow-md rounded-full mx-1.5"
        source={pictureUrl || imageSrc}
      />
      <Text className="text-xs">{label}</Text>
    </Pressable>
  );
};
