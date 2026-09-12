import { ApplicationHeader } from "@/components/shared/AppHeader";
import { Loader } from "@/components/shared/lotties/Loader";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { useJob } from "@/hooks/content/job/useJob";
import { cn } from "@/lib/utils";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { View } from "react-native";
import { JobStatistics } from "./JobStatistics";
import { JobActions } from "./JobActions";
import { useColorPalette } from "@/hooks/useColorPalette";
import { AppHeaderBack } from "@/components/shared/AppHeaderBack";
import { RequestsList } from "@/components/jobs/requests/RequestList";
import { useTranslation } from "react-i18next";

interface JobManagementInstanceProps {
  id: string;
  className?: string;
}

const Tab = createMaterialTopTabNavigator();

export const JobManagementInstance = ({
  id,
  className,
}: JobManagementInstanceProps) => {
  const { palette } = useColorPalette();
  const { t } = useTranslation("jobs");
  const { job, isJobPending } = useJob({ id });

  if (isJobPending)
    return <Loader className="flex-1 justify-center items-center" />;
  return (
    <StableSafeAreaView className={cn("flex flex-1 bg-card", className)}>
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        title={job?.title || t("management.title")}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
      />
      <View className="flex-1 bg-background">
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "600",
              textTransform: "none",
            },
            tabBarIndicatorStyle: { backgroundColor: palette.primary },
            tabBarStyle: { backgroundColor: "transparent" },
          }}
          commonOptions={{
            sceneStyle: {
              flex: 1,
            },
          }}
        >
          {/* <Tab.Screen
            name="about"
            options={{
              tabBarLabel: "Summary",
            }}
          >
            {() => <JobSummary job={job} />}
          </Tab.Screen> */}

          <Tab.Screen
            name="career"
            options={{
              tabBarLabel: t("management.tabs.statistics"),
            }}
          >
            {() => <JobStatistics jobId={id} />}
          </Tab.Screen>
          <Tab.Screen
            name="requests"
            options={{
              tabBarLabel: t("management.tabs.requests"),
            }}
          >
            {() => (
              <RequestsList
                variant="incoming"
                jobId={id}
                className="pt-2 mx-4"
                embedded
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="gallery"
            options={{
              tabBarLabel: t("management.tabs.actions"),
            }}
          >
            {() => <JobActions id={id} className="p-2" />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </StableSafeAreaView>
  );
};
