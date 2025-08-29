import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { MapPin, Star } from "lucide-react-native";
import { View } from "react-native";
import { api } from "~/api";
import { StablePressable } from "~/components/shared/StablePressable";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { identifyUser } from "~/lib/user.utils";
import { ResponseClientDto } from "~/types";
import { NavigationProps } from "~/types/app.routes";

interface UserEntryProps {
  className?: string;
  user: ResponseClientDto;
}

export const UserEntry = ({ className, user }: UserEntryProps) => {
  const navigation = useNavigation<NavigationProps>();
  const { data: profilePicture } = useQuery({
    queryKey: ["profile-picture", user?.profile?.pictureId],
    queryFn: () => api.upload.getUploadById(user?.profile?.pictureId!),
    enabled: !!user?.profile?.pictureId,
    staleTime: Infinity,
  });
  return (
    <StablePressable
      className={className}
      onPress={() =>
        navigation.navigate("explore/user-profile", { id: user.id })
      }
      onPressClassname="bg-secondary/10"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex flex-row justify-between items-center gap-3">
          <View className="w-10 h-10 bg-accent/20 rounded-full items-center justify-center">
            <Image
              source={profilePicture}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              cachePolicy="memory-disk"
            />
          </View>
          <View>
            <Text className="text-base font-medium text-card-foreground">
              {identifyUser(user)}
            </Text>
            <View className="flex-row items-center gap-4 mt-1">
              <View className="flex-row items-center gap-1">
                <Star size={12} color="#fbbf24" fill="#fbbf24" />
                <Text className="text-xs text-muted-foreground">
                  4.9 (127 reviews)
                </Text>
              </View>
              {user.profile?.region && (
                <View className="flex-row items-center gap-1">
                  <MapPin size={12} color="#6366f1" />
                  <Text className="text-xs text-muted-foreground">
                    {user.profile.region.label}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <Button size={"sm"}>
          <Text>Follow</Text>
        </Button>
      </View>
    </StablePressable>
  );
};
