import { Success } from "@/components/shared/lotties/Success";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import React from "react";

interface JobCreatedSuccessProps {
  jobId: string;
}

export const JobCreatedSuccess = ({ jobId }: JobCreatedSuccessProps) => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Success
        message="Your job has been created successfully"
        size={300}
        className="flex flex-col justify-center items-center"
        textProps={{
          className: "text-center text-lg font-bold mt-4",
        }}
      />
      <View className="w-full flex-col gap-3 mt-8 px-4">
        <Button
          onPress={() =>
            router.replace({
              pathname: "/main/explore/job-details",
              params: { id: jobId },
            })
          }
        >
          <Text className="text-white text-center">View Job</Text>
        </Button>
        <Button
          variant="outline"
          onPress={() => router.replace("/main/(tabs)")}
        >
          <Text className="text-center">Go back to explore</Text>
        </Button>
      </View>
    </View>
  );
};
