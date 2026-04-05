import { View } from "react-native";
import { ProfileSection } from "./profile-section";
import { Text } from "~/components/ui/text";
import { StablePressable } from "~/components/shared/StablePressable";
import { cn } from "~/lib/utils";
import { router } from "expo-router";
import { Icon } from "~/components/ui/icon";
import { Pen, Plus } from "lucide-react-native";
import { Separator } from "~/components/ui/separator";

export const RenderSection = (section: ProfileSection) => {
  return (
    <View className="flex flex-col flex-1" key={section.key}>
      <View className={cn("flex flex-1 pt-x bg-card border border-border")}>
        <View className="flex flex-row items-center justify-between bg-primary/10">
          <View className="p-4">
            <Text variant="h4">{section.title}</Text>
          </View>
          {section.editable && (
            <View className="flex flex-row gap-1 items-center p-2">
              <StablePressable
                className="p-2"
                onPress={() => {
                  switch (section.key) {
                    case "experience":
                      router.push("/main/account/create-experience");
                      break;
                    case "education":
                      router.push("/main/account/create-education");
                      break;
                    case "skills":
                      router.push("/main/account/create-skill");
                      break;
                  }
                }}
                onPressClassname="bg-primary/25 rounded-full"
              >
                <Icon as={Plus} size={20} className="text-muted-foreground" />
              </StablePressable>
              <StablePressable
                className="p-2"
                onPress={() => {
                  switch (section.key) {
                    case "experience":
                      router.push("/main/account/update-experiences");
                      break;
                    case "education":
                      router.push("/main/account/update-educations");
                      break;
                    case "skills":
                      router.push("/main/account/update-skills");
                      break;
                  }
                }}
                onPressClassname="bg-primary/25 rounded-full"
              >
                <Icon as={Pen} size={18} className="text-muted-foreground" />
              </StablePressable>
            </View>
          )}
        </View>
      </View>

      <Separator />

      <View className="p-4">
        {section.data?.length === 0 ? (
          <View key={section.key}>
            <Text className="text-sm text-muted-foreground italic text-center my-4">
              No {section.title} added yet
            </Text>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {Array.isArray(section.data) &&
              section.data.map((item, idx) => (
                <View key={idx}>{section.renderItem(item)}</View>
              ))}
          </View>
        )}
      </View>
    </View>
  );
};
