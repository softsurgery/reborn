import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Heart, Briefcase, FileText, CheckCircle } from "lucide-react-native";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { showToastable } from "react-native-toastable";
import { ResponseJobDto } from "~/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { cn } from "~/lib/utils";

interface JobCardProps {
  className?: string;
  job: ResponseJobDto;
}

export const JobCard = ({ className, job }: JobCardProps) => {
  const [saved, setSaved] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  const handleSave = (e: any) => {
    e.stopPropagation();
    setSaved(!saved);
    if (!saved) {
      showToastable({ message: "Job has been saved", status: "success" });
    }
  };

  const handleCardPress = () => {
    navigation.navigate("job-details", {
      job: JSON.stringify(job),
    });
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      className={cn(
        "px-4 w-full py-4 gap-2 border-2 border-border rounded-lg",
        className
      )}
      activeOpacity={0.7}
    >
      <Image
        source={require("~/assets/images/icon.png")}
        className="w-full h-48 rounded-lg mb-3"
        resizeMode="cover"
      />
      <View className="flex-row justify-between items-start">
        <Text className="font-semibold text-xl text-black dark:text-white flex-1 pr-2">
          {job.title}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Heart
            size={24}
            color={saved ? "#ef4444" : "#6b7280"}
            fill={saved ? "#ef4444" : "none"}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center gap-1 space-x-2">
        <Briefcase size={16} color="#6b7280" />
        <Text className="text-gray-600 dark:text-gray-400 text-m">
          TND {job.price}
        </Text>
      </View>

      <View className="flex-row items-center gap-1 space-x-2">
        <FileText size={16} color="#6b7280" />
        <Text className="text-gray-600 dark:text-gray-400 text-m">
          Proposals: 0
        </Text>
      </View>

      <View className="flex-row items-center gap-1 space-x-2">
        <CheckCircle color={"#3b82f6"} size={16} />
        <Text className="text-gray-600 dark:text-gray-400 text-m">
          {/* {job.paymentVerified ? "Payment verified" : "Payment not verified"} ·{" "} */}
          {/* {job.spent}  */}
          To be determined
        </Text>
      </View>

      <Text className="text-gray-700 dark:text-gray-300 text-m">
        {showFullDesc ? job.description : `${job.description.slice(0, 100)}...`}
      </Text>

      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation(); // Prevent navigation when expanding description
          setShowFullDesc(!showFullDesc);
        }}
      >
        <Text className="text-green-600 dark:text-green-400 underline text-sm font-semibold">
          {showFullDesc ? "View Less" : "View More"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row flex-wrap gap-2 mt-1">
        {/* {job.tags.map((tag: string, index: number) => (
          <View
            key={index}
            className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
          >
            <Text className="text-sm text-gray-700 dark:text-gray-300">
              {tag}
            </Text>
          </View>
        ))} */}
        <Text className="text-sm text-gray-700 dark:text-gray-300">
          No tags specified
        </Text>
      </View>

      <Text className="text-gray-500 text-sm mt-1">
        {/* {job.postedAgo} */}
        Not specified
      </Text>
    </TouchableOpacity>
  );
};
