import { ApplicationHeader } from "@reborn/mobile-components";
import { Loader } from "@reborn/mobile-components";
import { StableSafeAreaView } from "@reborn/mobile-components";
import { useJob } from "@/hooks/content/job/useJob";
import { cn } from "@reborn/lib";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { View } from "react-native";
import { JobStatistics } from "./JobStatistics";
import { JobActions } from "./JobActions";
import { JobLifecyclePortal } from "./JobLifecyclePortal";
import { JobWorkPortal } from "./JobWorkPortal";
import { useColorPalette } from "@reborn/mobile-components";
import { AppHeaderBack } from "@reborn/mobile-components";
import { RequestsList } from "@/components/jobs/requests/RequestList";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";
import { getJobLifecycleRole } from "@/lib/job-lifecycle";

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
  const { currentUser, isCurrentUserPending } = useCurrentUser();
  const { job, isJobPending } = useJob({
    id,
    join: ["postedBy", "worker"],
  });

  const role = getJobLifecycleRole({
    userId: currentUser?.id,
    postedById: job?.postedById ?? job?.postedBy?.id,
    workerId: job?.workerId,
  });
  const isOwner = role === "client";

  if (isJobPending || isCurrentUserPending)
    return <Loader className="flex-1 justify-center items-center" />;

  if (role === "worker") {
    return (
      <StableSafeAreaView className={cn("flex flex-1 bg-card", className)}>
        <ApplicationHeader
          classNames={{ wrapper: "border-b border-border pb-2" }}
          title={job?.title || t("management.work.title")}
          titleVariant="large"
          reverse
          shortcuts={[
            {
              key: "back",
              render: <AppHeaderBack />,
            },
          ]}
        />
        <JobWorkPortal id={id} />
      </StableSafeAreaView>
    );
  }

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
            tabBarScrollEnabled: isOwner,
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
            name="progress"
            options={{
              tabBarLabel: t("management.tabs.progress"),
            }}
          >
            {() => <JobLifecyclePortal id={id} />}
          </Tab.Screen>
          {isOwner ? (
            <Tab.Screen
              name="career"
              options={{
                tabBarLabel: t("management.tabs.statistics"),
              }}
            >
              {() => <JobStatistics jobId={id} />}
            </Tab.Screen>
          ) : null}
          {isOwner ? (
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
          ) : null}
          {isOwner ? (
            <Tab.Screen
              name="gallery"
              options={{
                tabBarLabel: t("management.tabs.actions"),
              }}
            >
              {() => <JobActions id={id} className="p-2" />}
            </Tab.Screen>
          ) : null}
        </Tab.Navigator>
      </View>
    </StableSafeAreaView>
  );
};
