import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";

export async function setAndroidNavigationBar(theme: "light" | "dark") {
  if (Platform.OS !== "android") return;

  await NavigationBar.setButtonStyleAsync(theme === "dark" ? "light" : "dark");

  const behavior = await NavigationBar.getBehaviorAsync();
  if (behavior !== "overlay-swipe") {
    await NavigationBar.setBackgroundColorAsync(
      theme === "dark" ? NAV_THEME.dark.background : NAV_THEME.light.background
    );
  }
}
