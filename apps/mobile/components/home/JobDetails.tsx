"use client";

import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

import {
  Heart,
  FileText,
  CheckCircle,
  MapPin,
  Clock,
  Star,
  User,
  Calendar,
  DollarSign,
} from "lucide-react-native";
import { showToastable } from "react-native-toastable";
import type { NavigationProps } from "~/types/app.routes";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { StableKeyboardAwareScrollView } from "../shared/KeyboardAwareScrollView";
import { identifyUser } from "~/lib/user.utils";
import { format } from "date-fns";
import { timeAgo } from "~/lib/dates.utils";
import { Image } from "expo-image";

export const JobDetails = () => {
  const navigation = useNavigation<NavigationProps>();
  const { id } = useLocalSearchParams();
  const [saved, setSaved] = React.useState(false);

  const { data: jobResp, isPending } = useQuery({
    queryKey: ["job", id],
    queryFn: () => api.job.findById(id as string),
  });

  const job = React.useMemo(() => {
    return jobResp ? jobResp : null;
  }, [jobResp]);

  const { data: profilePicture } = useQuery({
    queryKey: ["profile-picture", jobResp?.postedBy?.profile?.pictureId],
    queryFn: () =>
      api.upload.getUploadById(jobResp?.postedBy?.profile?.pictureId!),
    enabled: !!jobResp?.postedBy?.profile?.pictureId,
    staleTime: Infinity,
  });

  const handleApply = () => {
    console.log("Apply to job:", id);
  };

  const handleSave = (e: any) => {
    e.stopPropagation();
    setSaved(!saved);
    if (!saved) {
      showToastable({
        message: "Saved to favorites",
        status: "success",
      });
    }
  };

  if (!id) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-xl text-foreground">Job not found</Text>
        <Button onPress={() => navigation.goBack()} className="mt-4">
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 pb-2">
      <View className="bg-card px-6 py-5 border-b border-border">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 pr-4">
            <Text className="text-2xl font-bold text-foreground mb-1">
              {job?.title || "Senior Full Stack Developer"}
            </Text>
            <View className="flex-row items-center gap-4 mb-2">
              <View className="flex-row items-center gap-1">
                <DollarSign size={16} color="#6366f1" />
                <Text className="text-lg font-semibold text-accent">
                  {job?.price} TND
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Clock size={14} color="#9ca3af" />
                <Text className="text-sm text-muted-foreground">
                  {timeAgo(job?.createdAt || new Date())}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleSave} className="p-2">
            <Heart
              size={24}
              color={saved ? "#ef4444" : "#9ca3af"}
              fill={saved ? "#ef4444" : "none"}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-5">
          <View className="flex-row items-center gap-1">
            <FileText size={14} color="#6366f1" />
            <Text className="text-sm text-card-foreground">3 proposals</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <CheckCircle size={14} color="#16a34a" />
            <Text className="text-sm text-card-foreground">
              Payment verified
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-sm text-card-foreground">
              4.8 client rating
            </Text>
          </View>
        </View>
      </View>

      <View className="flex flex-col flex-1 gap-4 px-6 py-5">
        {/* About Project */}
        <View>
          <Text className="text-lg font-semibold text-foreground mb-2">
            About this project
          </Text>
          <Text className="text-card-foreground leading-6 text-sm">
            {job?.description ||
              "We're looking for an experienced full-stack developer to build a modern web application using React and Node.js. The project involves creating a user-friendly interface, implementing secure authentication, and integrating with third-party APIs. You'll work closely with our design team to bring mockups to life and ensure optimal performance across all devices."}
          </Text>
        </View>

        {/* SKills  */}
        <Text className="text-base font-medium text-foreground">
          Skills needed
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <View className="bg-accent/10 px-2 py-1 rounded">
            <Text className="text-xs text-accent font-medium">React</Text>
          </View>
          <View className="bg-accent/10 px-2 py-1 rounded">
            <Text className="text-xs text-accent font-medium">Node.js</Text>
          </View>
          <View className="bg-accent/10 px-2 py-1 rounded">
            <Text className="text-xs text-accent font-medium">TypeScript</Text>
          </View>
          <View className="bg-accent/10 px-2 py-1 rounded">
            <Text className="text-xs text-accent font-medium">MongoDB</Text>
          </View>
        </View>

        <Text className="text-base font-medium text-foreground">
          Project scope
        </Text>
        <View className="space-y-1">
          <View className="flex-row items-center gap-2">
            <Calendar size={12} color="#6366f1" />
            <Text className="text-xs text-muted-foreground">3-6 months</Text>
          </View>
          <Text className="text-xs text-muted-foreground">
            Intermediate level
          </Text>
          <Text className="text-xs text-muted-foreground">Remote work</Text>
        </View>
      </View>

      {/* Client Informations */}
      <View className="px-6 py-4">
        <Text className="text-lg font-semibold text-foreground mb-3">
          Client information
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-accent/20 rounded-full items-center justify-center">
              <Image
                source={profilePicture}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
                cachePolicy="memory-disk"
              />
            </View>
            <View>
              <Text className="text-base font-medium text-card-foreground">
                {job?.postedBy.firstName && job.postedBy.lastName
                  ? `${job.postedBy.firstName} ${job.postedBy.lastName}`
                  : job?.postedBy.username || "Sarah Johnson"}
              </Text>
              <View className="flex-row items-center gap-4 mt-1">
                <View className="flex-row items-center gap-1">
                  <Star size={12} color="#fbbf24" fill="#fbbf24" />
                  <Text className="text-xs text-muted-foreground">
                    4.9 (127 reviews)
                  </Text>
                </View>
                {job?.postedBy.profile?.region && (
                  <View className="flex-row items-center gap-1">
                    <MapPin size={12} color="#6366f1" />
                    <Text className="text-xs text-muted-foreground">
                      {job.postedBy.profile.region.label}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-xs text-muted-foreground">Member since</Text>
            <Text className="text-xs text-card-foreground font-medium">
              {job?.postedBy.createdAt
                ? format(job.postedBy.createdAt, "MMMM yyyy")
                : ""}
            </Text>
            <Text className="text-xs text-muted-foreground">89% hire rate</Text>
          </View>
        </View>
      </View>

      <View className="px-6 py-5 bg-card border-t border-border">
        <Button
          onPress={handleApply}
          className="w-full bg-accent text-accent-foreground py-3 rounded-lg"
          size="lg"
        >
          <Text className="text-base font-semibold">Apply for this job</Text>
        </Button>
        <Text className="text-xs text-muted-foreground text-center mt-2">
          You'll be able to chat with
          <Text className="font-medium"> {identifyUser(job?.postedBy)} </Text>
          before starting work
        </Text>
      </View>
    </View>
  );
};
