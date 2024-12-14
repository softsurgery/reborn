import * as React from "react";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { Bug } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Textarea } from "~/components/ui/textarea";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useReportBugManger } from "./hooks/useReportBugManager";
import { BUG_CATEGORIES } from "~/constants/bug-categories";
import { useMutation } from "@tanstack/react-query";
import { firebaseFns } from "~/firebase";
import { Toast } from "react-native-toast-notifications";

export default function Screen() {
  const reportbugManager = useReportBugManger();

  const { mutate: createBug, isPending: isBugCreationPending } = useMutation({
    mutationFn: async () =>
      firebaseFns.bugService.postBug(reportbugManager.getBug()),
    onSuccess: (data) => {
      Toast.show(data.message, {
        style: { backgroundColor: "green" },
      });
      //   reportbugManager.reset();
    },
    onError: (error) => {
        Toast.show("oops! Failed to submit bug report", {
          style: { backgroundColor: "red" },
        });
  
    },
  });

  const handleSubmit = () => {
    createBug();
  };

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <KeyboardAwareScrollView bounces={false}>
      <ScrollView
        bounces={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
      >
        <View className="flex flex-col gap-5 my-5 px-4">
          {/* Header Section */}
          <View className="mx-auto">
            <IconWithTheme icon={Bug} size={52} className="mx-auto" />
          </View>
          <View>
            <Text className="font-extrabold">
              Help us improve by reporting any issues you encounter.
            </Text>
            <Text className="font-thin mt-2">
              Please provide as much detail as possible
            </Text>
          </View>

          {/* Bug Title Field */}
          <View>
            <Text className="font-semibold mb-2">Bug Title (*)</Text>
            <Input
              editable={!isBugCreationPending}
              value={reportbugManager.title}
              onChangeText={(value: string) =>
                reportbugManager.set("title", value)
              }
              placeholder="Brief summary of the issue"
              className="p-3 rounded-md"
            />
          </View>
          {/* Bug Description Field */}
          <View>
            <Text className="font-semibold mb-2">Description (*)</Text>
            <Textarea
              editable={!isBugCreationPending}
              placeholder="Detailed description of the bug"
              value={reportbugManager.description}
              onChangeText={(value: string) =>
                reportbugManager.set("description", value)
              }
              numberOfLines={5}
              multiline
            />
          </View>
          {/* Category Dropdown */}
          <View>
            <Text className="font-semibold mb-2">Category (*)</Text>
            <Select
              disabled={isBugCreationPending}
              defaultValue={{
                value: reportbugManager.category || BUG_CATEGORIES[0],
                label: reportbugManager.category || BUG_CATEGORIES[0],
              }}
              onValueChange={(option) =>
                reportbugManager.set("category", option?.value)
              }
            >
              <SelectTrigger>
                <SelectValue
                  className="text-foreground text-sm native:text-lg opacity-70"
                  placeholder="Please select a category"
                />
              </SelectTrigger>
              <SelectContent insets={contentInsets} className="w-full">
                {BUG_CATEGORIES.map((category) => {
                  return (
                    <SelectItem
                      label={category}
                      value={category}
                      key={category}
                    >
                      {category}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </View>
          {/* Submit Button */}
          <Button
            disabled={isBugCreationPending}
            className="w-full"
            variant={"outline"}
            onPress={handleSubmit}
          >
            <Text>{isBugCreationPending ? "Submitting..." : "Submit Bug"}</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
