import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";
import { Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";


interface PictureUploaderProps {
  className?: string;
  image?: any;
  fallback?: string;
  form?: "CERCULAR" | "CUBIC" | null;
  onChange?: (image: any) => void;
}

export const PictureUploader = ({
  className,
  image,
  fallback = "Unknown",
  form = "CERCULAR",
  onChange,
}: PictureUploaderProps) => {

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onChange?.(result.assets[0].uri);
    }
  };
  return (
    <Pressable className={cn(className)}>
      <Button
        variant="link"
        className="h-fit w-fit p-0 mx-auto rounded-full"
        onPress={pickImage}
      >
        <Avatar alt="Zach Nugent's Avatar" className="w-40 h-40">
          {image ? (
            <AvatarImage source={{ uri: image }} />
          ) : (
            <AvatarImage
              source={require("~/assets/images/adaptive-icon.png")}
            />
          )}
          <AvatarFallback>
            <Text>{fallback}f</Text>
          </AvatarFallback>
        </Avatar>
      </Button>

      <Text className="text-center text-sm italic font-light">
        Click to Update Profile Picture
      </Text>
    </Pressable>
  );
};
