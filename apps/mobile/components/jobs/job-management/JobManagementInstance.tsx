import { api } from "@/api";
import { ApplicationHeader } from "@/components/shared/AppHeader";
import { Loader } from "@/components/shared/Loader";
import { StableSafeAreaView } from "@/components/shared/StableSafeAreaView";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView } from "react-native";

interface JobManagementInstanceProps {
  id: string;
  className?: string;
}

const Tab = createMaterialTopTabNavigator();

export const JobManagementInstance = ({
  id,
  className,
}: JobManagementInstanceProps) => {
  const { data: job, isPending: isJobPending } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => api.job.findById(id),
  });
  if (isJobPending)
    return <Loader className="flex-1 justify-center items-center" />;
  return (
    <StableSafeAreaView className={cn("flex flex-1 bg-card", className)}>
      <ApplicationHeader
        className="border-b border-border pb-2"
        title={`${job?.title.slice(0, 30)}...` || "Job Management"}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            icon: ArrowLeft,
            onPress: () => router.back(),
          },
        ]}
      />
      <ScrollView className="flex-1 bg-background">
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "600",
              textTransform: "none",
            },
            tabBarIndicatorStyle: { backgroundColor: "#9B2C2C" },
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
            {() => <></>}
          </Tab.Screen>

          <Tab.Screen
            name="career"
            options={{
              tabBarLabel: "Statistics",
            }}
          >
            {() => <></>}
          </Tab.Screen>
          <Tab.Screen
            name="gallery"
            options={{
              tabBarLabel: "Actions",
            }}
          >
            {() => <></>}
          </Tab.Screen>
        </Tab.Navigator>
      </ScrollView>
    </StableSafeAreaView>
  );
};
