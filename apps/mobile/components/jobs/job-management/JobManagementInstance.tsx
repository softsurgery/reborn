import { ApplicationHeader } from "@/components/shared/AppHeader";
import { Loader } from "@/components/shared/lotties/Loader";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { useJob } from "@/hooks/content/job/useJob";
import { cn } from "@/lib/utils";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { ScrollView, View } from "react-native";
interface JobManagementInstanceProps {
  id: string;
  className?: string;
}

const Tab = createMaterialTopTabNavigator();

export const JobManagementInstance = ({
  id,
  className,
}: JobManagementInstanceProps) => {
  const { job, isJobPending } = useJob({ id });

  if (isJobPending)
    return <Loader className="flex-1 justify-center items-center" />;
  return (
    <StableSafeAreaView className={cn("flex flex-1 bg-card", className)}>
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        title={`${job?.title.slice(0, 30)}...` || "Job Management"}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            icon: ChevronLeft,
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
            component={View}
          />

          <Tab.Screen
            name="career"
            options={{
              tabBarLabel: "Statistics",
            }}
            component={View}
          />
          <Tab.Screen
            name="gallery"
            options={{
              tabBarLabel: "Actions",
            }}
            component={View}
          />
        </Tab.Navigator>
      </ScrollView>
    </StableSafeAreaView>
  );
};
