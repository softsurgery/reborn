import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

import {
  Heart,
  Briefcase,
  FileText,
  CheckCircle,
  MapPin,
  Clock,
  Star,
  User,
  Calendar,
} from "lucide-react-native";
import { ResponseJobDto } from "~/types";
import { showToastable } from "react-native-toastable";

export default function JobDetailsScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  // Parse the job data from params
  const job: ResponseJobDto = JSON.parse(params.job as string);

  if (!job) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-xl text-foreground">Job not found</Text>
        <Button onPress={() => navigation.goBack()} className="mt-4">
          Go Back
        </Button>
      </View>
    );
  }

  const [saved, setSaved] = React.useState(false);

  const handleApply = () => {
    // Handle job application logic
    console.log("Apply to job:", job.id);
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

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 space-y-4">
        {/* Job Header */}
        <Card>
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-foreground">
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
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <View className="flex-row items-center gap-2">
                <Briefcase size={16} color="#6b7280" />
                <Text className="text-lg font-semibold text-foreground">
                  TND {job.price}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <FileText size={16} color="#6b7280" />
                <Text className="text-foreground">
                  Proposals: Not specified
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <CheckCircle size={16} color="#3b82f6" />
                <Text className="text-foreground">
                  Payment verification pending
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Clock size={16} color="#6b7280" />
                <Text className="text-muted-foreground">Recently posted</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <Text className="text-xl font-semibold text-foreground">
              Job Description
            </Text>
          </CardHeader>
          <CardContent>
            <Text className="text-foreground leading-6">{job.description}</Text>
          </CardContent>
        </Card>

        {/* Skills Required */}
        <Card>
          <CardHeader>
            <Text className="text-xl font-semibold text-foreground">
              Skills Required
            </Text>
          </CardHeader>
          <CardContent>
            <View className="flex-row flex-wrap gap-2">
              <Text>No skills specified</Text>
            </View>
          </CardContent>
        </Card>

        {/* Job Tags */}
        <Card>
          <CardHeader>
            <Text className="text-xl font-semibold text-foreground">Tags</Text>
          </CardHeader>
          <CardContent>
            <View className="flex-row flex-wrap gap-2">
              {/* {job.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  <Text>{tag}</Text>
                </Badge>
              ))} */}
              <Text>No tags specified</Text>
            </View>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardHeader>
            <Text className="text-xl font-semibold text-foreground">
              Job Details
            </Text>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <View className="flex-row items-center gap-2">
                <Text className="font-medium text-foreground">
                  Project Type:
                </Text>
                <Text className="text-foreground">Not specified</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Calendar size={16} color="#6b7280" />
                <Text className="font-medium text-foreground">Duration:</Text>
                <Text className="text-foreground">To be determined</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="font-medium text-foreground">
                  Experience Level:
                </Text>
                <Text className="text-foreground">Not specified</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <Text className="text-xl font-semibold text-foreground">
              About the Client
            </Text>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <View className="flex-row items-center gap-2">
                <User size={16} color="#6b7280" />
                <Text className="text-foreground font-medium">
                  {job.postedBy.firstName && job.postedBy.lastName
                    ? `${job.postedBy.firstName} ${job.postedBy.lastName}`
                    : job.postedBy.username}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text className="text-foreground">Rating not available</Text>
              </View>

              {job.postedBy.profile?.region && (
                <View className="flex-row items-center gap-2">
                  <MapPin size={16} color="#6b7280" />
                  <Text className="text-foreground">
                    {job.postedBy.profile.region.label}
                  </Text>
                </View>
              )}

              <View className="flex-row items-center gap-2">
                <CheckCircle size={16} color="#22c55e" />
                <Text className="text-foreground">Hire rate not available</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Apply Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onPress={handleApply}
              className="w-full bg-primary text-primary-foreground"
              size="lg"
            >
              <Text>Apply Now</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
