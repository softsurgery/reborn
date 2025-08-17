import React from "react";
import { StableScrollView } from "../shared/StableScrollView";
import { DarkModePreferenceCard } from "./DarkModePreferenceCard";
import { useColorScheme } from "~/lib/useColorScheme";

const UserPreferencesPortal: React.FC = () => {
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  return (
    <StableScrollView className="p-4">
      <DarkModePreferenceCard
        onPress={toggleColorScheme}
        isDark={isDarkColorScheme}
      />
    </StableScrollView>
  );
};

export default UserPreferencesPortal;
