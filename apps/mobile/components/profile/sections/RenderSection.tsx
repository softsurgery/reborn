import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { StablePressable } from "~/components/shared/StablePressable";
import { cn } from "~/lib/utils";
import { router } from "expo-router";
import { Icon } from "~/components/ui/icon";
import { Pen, Plus } from "lucide-react-native";
import { Separator } from "~/components/ui/separator";

export interface ProfileSection<T = unknown> {
  key: string;
  title: string;
  data: T[];
  editable: boolean;
  renderItem: (item: any) => React.ReactNode;
}

export const RenderSection = (section: ProfileSection) => {
  return (
    <View className="flex flex-col flex-1 bg-background" key={section.key}>
      <View className={cn("flex flex-1")}>
        <View className="flex flex-row items-center justify-between">
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
                      router.push({
                        pathname: "/main/account/update-experiences",
                      });
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
        <Separator />
      </View>

      <View className="p-4 border-b border-border flex-1 bg-background">
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
