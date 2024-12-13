import * as React from "react";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { Info } from "lucide-react-native";
import { Alert, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function Screen() {
    const [bugTitle, setBugTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = ["Crash", "UI Issue", "Performance", "Feature Not Working", "Other"];

    const handleSubmit = () => {
        if (!bugTitle || !description) {
            Alert.alert("Missing Information", "Please fill out all required fields.");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call or submission logic
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert("Thank You!", "Your bug report has been submitted successfully.");
            setBugTitle("");
            setDescription("");
            setCategory("");
        }, 2000);
    };

    return (
        <KeyboardAwareScrollView className="px-4">
            {/* Header Section */}
            <View className="flex flex-row gap-2 items-center mb-4">
                <IconWithTheme icon={Info} size={20} />
                <Text className="font-extrabold">
                    Help us improve by reporting any issues you encounter. Please provide as much detail as possible.
                </Text>
            </View>

            {/* Bug Title Field */}
            <View className="mb-4">
                <Text className="font-semibold mb-2">Bug Title *</Text>
                <Input
                    value={bugTitle}
                    onChangeText={setBugTitle}
                    placeholder="Brief summary of the issue"
                    className="border border-gray-300 p-3 rounded-md"
                />
            </View>

            {/* Bug Description Field */}
            <View className="mb-4">
                <Text className="font-semibold mb-2">Description *</Text>
                <Input
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Detailed description of the bug"
                    multiline
                    numberOfLines={4}
                    className="border border-gray-300 p-3 rounded-md"
                />
            </View>

            {/* Category Dropdown */}
            <View className="mb-4">
                <Text className="font-semibold mb-2">Category *</Text>
                <Input
                    value={category}
                    onChangeText={setCategory}
                    placeholder="Select a category (e.g., Crash, UI Issue)"
                    className="border border-gray-300 p-3 rounded-md"
                />
            </View>

            {/* Submit Button */}
            <Button
                onPress={handleSubmit}
                className="w-full"
                variant={'outline'}
                disabled={isSubmitting}
            ><Text>{isSubmitting ? "Submitting..." : "Submit Bug"}</Text></Button>
        </KeyboardAwareScrollView>
    );
}
