import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Heart, Briefcase, FileText, CheckCircle } from "lucide-react-native";
import { cn } from "~/lib/utils";
import { Toast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import { Job } from "~/types/Job";

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const [saved, setSaved] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const router = useRouter();

  const handleSave = (e: any) => {
    e.stopPropagation(); // Prevent navigation when saving
    setSaved(!saved);
    if (!saved) {
      Toast.show("Job has been saved", {
        style: { backgroundColor: "green" },
      });
    }
  };

  const handleCardPress = () => {
    router.push({
      pathname: "/job-details",
      params: { job: JSON.stringify(job) },
    });
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      className="px-4 w-full py-4 gap-2"
      activeOpacity={0.7}
    >
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
          {job.price}
        </Text>
      </View>

      <View className="flex-row items-center gap-1 space-x-2">
        <FileText size={16} color="#6b7280" />
        <Text className="text-gray-600 dark:text-gray-400 text-m">
          Proposals: {job.proposals}
        </Text>
      </View>

      <View className="flex-row items-center gap-1 space-x-2">
        <CheckCircle
          size={16}
          color={job.paymentVerified ? "#3b82f6" : "#9ca3af"}
        />
        <Text className="text-gray-600 dark:text-gray-400 text-m">
          {job.paymentVerified ? "Payment verified" : "Payment not verified"} ·{" "}
          {job.spent}
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
        {job.tags.map((tag: string, index: number) => (
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

      <Text className="text-gray-500 text-sm mt-1">{job.postedAgo}</Text>
    </TouchableOpacity>
  );
};
