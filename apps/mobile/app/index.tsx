import React from "react";
import Application from "~/components/Application";
import { Loader } from "~/components/Loader";
import OnBoarding from "~/components/OnBoarding";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";

export default function Screen() {
  const { isAuthenticated, isReady } = useAuthPersistStore();

  if (!isReady) return <Loader />;
  if (isAuthenticated) return <Application />;
  return <OnBoarding />;
}
