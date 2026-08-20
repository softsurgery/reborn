import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { ResponseUserDto } from "@/types";
import { useColorPalette } from "@/hooks/useColorPalette";
import { hslToHex } from "@/lib/theme";
import { useRTL } from "@/hooks/useRTL";
import { AboutTab } from "./sections/AboutTab";
import { JobsTab } from "./sections/JobsTab";
import { CareerTab } from "./sections/CareerTab";
import { SnippetsTab } from "./sections/SnippetTab";
import { ProfileSection, RenderSection } from "./sections/RenderSection";

interface ProfileTabsProps {
  user: ResponseUserDto | null;
  currentUser?: ResponseUserDto | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  profileSections: ProfileSection[];
  handleScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollRef?: React.RefObject<any>;
  scrollToTop?: () => void;
}

const Tab = createMaterialTopTabNavigator();

export const ProfileTabs = ({
  user,
  currentUser,
  onRefresh,
  refreshing,
  profileSections,
  handleScroll,
  scrollRef,
  scrollToTop,
}: ProfileTabsProps) => {
  const { palette } = useColorPalette();
  const { t } = useTranslation("menu");
  const isRTL = useRTL();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: false,
        tabBarActiveTintColor: palette.foreground,
        tabBarInactiveTintColor: palette.mutedForeground,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
          textTransform: "none",
        },
        tabBarIndicatorStyle: {
          backgroundColor: hslToHex(palette.primary),
          height: 2,
          borderRadius: 2,
        },
        tabBarStyle: {
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: palette.border,
        },
      }}
      commonOptions={{
        sceneStyle: {
          flex: 1,
        },
      }}
      screenListeners={{
        state: () => scrollToTop?.(),
        tabPress: () => scrollToTop?.(),
      }}
    >
      {isRTL ? (
        <>
          <Tab.Screen
            name="gallery"
            options={{
              tabBarLabel: t("menu.tabs.gallery.title"),
            }}
          >
            {() => (
              <SnippetsTab
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderSection={RenderSection}
                profileSections={profileSections}
                onScroll={handleScroll}
                scrollRef={scrollRef}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="career"
            options={{
              tabBarLabel: t("menu.tabs.career.title"),
            }}
          >
            {() => (
              <CareerTab
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderSection={RenderSection}
                profileSections={profileSections}
                onScroll={handleScroll}
                scrollRef={scrollRef}
              />
            )}
          </Tab.Screen>

          {currentUser?.id !== user?.id && (
            <Tab.Screen
              name="jobs"
              options={{
                tabBarLabel: "Jobs",
              }}
            >
              {() => (
                <JobsTab
                  user={user}
                  onRefresh={onRefresh}
                  refreshing={refreshing}
                  onScroll={handleScroll}
                  scrollRef={scrollRef}
                />
              )}
            </Tab.Screen>
          )}

          <Tab.Screen
            name="about"
            options={{
              tabBarLabel: t("menu.tabs.about.title"),
            }}
          >
            {() => (
              <AboutTab
                user={user}
                onRefresh={onRefresh}
                refreshing={refreshing}
                onScroll={handleScroll}
                scrollRef={scrollRef}
              />
            )}
          </Tab.Screen>
        </>
      ) : (
        <>
          <Tab.Screen
            name="about"
            options={{
              tabBarLabel: t("menu.tabs.about.title"),
            }}
          >
            {() => (
              <AboutTab
                user={user}
                onRefresh={onRefresh}
                refreshing={refreshing}
                onScroll={handleScroll}
                scrollRef={scrollRef}
              />
            )}
          </Tab.Screen>

          {currentUser?.id !== user?.id && (
            <Tab.Screen
              name="jobs"
              options={{
                tabBarLabel: "Jobs",
              }}
            >
              {() => (
                <JobsTab
                  user={user}
                  onRefresh={onRefresh}
                  refreshing={refreshing}
                  onScroll={handleScroll}
                  scrollRef={scrollRef}
                />
              )}
            </Tab.Screen>
          )}

          <Tab.Screen
            name="career"
            options={{
              tabBarLabel: t("menu.tabs.career.title"),
            }}
          >
            {() => (
              <CareerTab
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderSection={RenderSection}
                profileSections={profileSections}
                onScroll={handleScroll}
                scrollRef={scrollRef}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="gallery"
            options={{
              tabBarLabel: t("menu.tabs.gallery.title"),
            }}
          >
            {() => (
              <SnippetsTab
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderSection={RenderSection}
                profileSections={profileSections}
                onScroll={handleScroll}
                scrollRef={scrollRef}
              />
            )}
          </Tab.Screen>
        </>
      )}
    </Tab.Navigator>
  );
};
