import { Success } from "@reborn/mobile-components";
import { View } from "react-native";
import { Button } from "@reborn/mobile-ui";
import { Text } from "@reborn/mobile-ui";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

interface JobCreatedSuccessProps {
  jobId: string;
}

export const JobCreatedSuccess = ({ jobId }: JobCreatedSuccessProps) => {
  const { t } = useTranslation("jobs");
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Success
        message={t("form.successMessage")}
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
          <Text className="text-white text-center">{t("form.viewJob")}</Text>
        </Button>
        <Button
          variant="outline"
          onPress={() => router.replace("/main/(tabs)")}
        >
          <Text className="text-center">{t("form.backToExplore")}</Text>
        </Button>
      </View>
    </View>
  );
};
