import { ApplicationHeader } from "@/components/shared/AppHeader";
import { Loader } from "@/components/shared/lotties/Loader";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { useJob } from "@/hooks/content/job/useJob";
import { cn } from "@/lib/utils";
import { View } from "react-native";
import { JobSummary } from "./JobSummary";
import { JobStatistics } from "./JobStatistics";
import { useColorPalette } from "@/hooks/useColorPalette";
import { AppHeaderBack } from "@/components/shared/AppHeaderBack";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { RequestsList } from "@/components/home/my-space/requests/RequestList";
import { JobActions } from "./JobActions";

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
  const { job, isJobPending } = useJob({ id });

  if (isJobPending)
    return <Loader className="flex-1 justify-center items-center" />;
  return (
    <StableSafeAreaView className={cn("flex flex-1 bg-card", className)}>
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        title={job?.title || "Job Management"}
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
          <Tab.Screen
            name="about"
            options={{
              tabBarLabel: "Summary",
            }}
          >
            {() => <JobSummary job={job} />}
          </Tab.Screen>

          <Tab.Screen
            name="career"
            options={{
              tabBarLabel: "Statistics",
            }}
          >
            {() => <JobStatistics />}
          </Tab.Screen>
          <Tab.Screen
            name="requests"
            options={{
              tabBarLabel: "Requests",
            }}
          >
            {() => (
              <RequestsList
                variant="incoming"
                jobId={id}
                className="pt-2 mx-4"
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="gallery"
            options={{
              tabBarLabel: "Actions",
            }}
          >
            {() => <JobActions id={id} className="p-2" />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </StableSafeAreaView>
  );
};
