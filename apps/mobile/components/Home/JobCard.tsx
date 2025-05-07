import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Heart, Briefcase, FileText, CheckCircle } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { Toast } from "react-native-toast-notifications";

interface JobCardProps {
  title?: string;
  price?: string;
  proposals?: string;
  paymentVerified?: boolean;
  spent?: string;
  description?: string;
  tags?: string[];
  postedAgo?: string;
}

export const JobCard = ({
  title = "Mobile App Designer",
  price = "Fixed: TND20",
  proposals = "Less than 10",
  paymentVerified = true,
  spent = "TND1k+ spent",
  description = "Create intuitive and visually appealing interfaces for mobile applications. Collaborate with product managers and developers to translate requirements into functional UI. Ensure consistency with design standards and contribute to our design system. Experience in Figma or Adobe XD is a plus. The ideal candidate has a strong portfolio, excellent communication skills, and attention to detail. Previous experience with cross-platform apps is preferred. Knowledge of accessibility and responsive design principles is essential.",

  tags = [
    "Designer",
    "UserInterface",
    "AppDevelopment",
    "CreativeDesign",
    "MobileAppDesign",
  ],
  postedAgo = "Posted 2 hours ago",
}: JobCardProps) => {
  const [saved, setSaved] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const handleSave = () => {
    setSaved(!saved);
    if (!saved) {
      Toast.show("Job has been saved", {
        style: { backgroundColor: "green" },
      });
    }
  };

  return (
    <View className="px-4 w-full py-2 gap-2">
      <View className="flex-row justify-between items-start">
        <Text className="font-semibold text-xl text-black dark:text-white">
          {title}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Heart size={20} color="#10b981" fill={saved ? "#10b981" : "none"} />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center gap-1 space-x-2">
        <Briefcase size={16} color="#6b7280" />
        <Text className="text-gray-600 dark:text-gray-400 text-m">{price}</Text>
      </View>

      <View className="flex-row items-center gap-1 space-x-2">
        <FileText size={16} color="#6b7280" />
        <Text className="text-gray-600 dark:text-gray-400 text-m">
          Proposals: {proposals}
        </Text>
      </View>

      <View className="flex-row items-center gap-1 space-x-2">
        <CheckCircle
          size={16}
          color={paymentVerified ? "#3b82f6" : "#9ca3af"}
        />
        <Text className="text-gray-600 dark:text-gray-400 text-m">
          {paymentVerified ? "Payment verified" : "Payment not verified"} ·{" "}
          {spent}
        </Text>
      </View>

      <Text className="text-gray-700 dark:text-gray-300 text-m">
        {showFullDesc ? description : `${description.slice(0, 100)}...`}
      </Text>

      <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
        <Text className="text-green-600 dark:text-green-400 underline text-sm font-semibold">
          {showFullDesc ? "View Less" : "View More"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row flex-wrap gap-2 mt-1">
        {tags.map((tag, index) => (
          <View
            key={index}
            className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
          >
            <Text className="text-sm text-gray-700 dark:text-gray-300">
              {tag}
            </Text>
          </View>
        ))}
      </View>

      <Text className="text-gray-500 text-sm mt-1">{postedAgo}</Text>
    </View>
  );
};
