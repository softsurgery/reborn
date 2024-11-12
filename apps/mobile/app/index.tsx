import * as React from "react";
import { useAuthFunctions } from "~/hooks/useAuthFunctions";
import OnBoarding from "~/components/OnBoarding";
import Application from "~/components/Application";
import { Loader } from "~/components/Loader";

export default function Screen() {
  const { isAuthenticated, isLoading } = useAuthFunctions();

  if (isLoading && !isAuthenticated) {
    return <Loader />;
  } else if (!isAuthenticated) return <OnBoarding />;
  else if (isAuthenticated) return <Application />;
  else return null;
}
