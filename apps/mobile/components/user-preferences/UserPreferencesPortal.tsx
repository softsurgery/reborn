import React from "react";
import { StableScrollView } from "../shared/StableScrollView";
import { DarkModePreferenceCard } from "./DarkModePreferenceCard";
import { useColorScheme } from "~/lib/useColorScheme";

const UserPreferencesPortal: React.FC = () => {
  return (
    <StableScrollView className="p-4">
      <DarkModePreferenceCard />
    </StableScrollView>
  );
};

export default UserPreferencesPortal;
