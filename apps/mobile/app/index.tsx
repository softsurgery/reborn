import * as React from "react";
import OnBoarding from "~/components/OnBoarding";
import Application from "~/components/Application";
import { useAuth } from "~/context/AuthContext";
import { Loader } from "~/components/Loader";

export default function Screen() {
  const { isAuthenticated, loading } = useAuth();
  if (loading && !isAuthenticated) return <Loader />;
  if (!isAuthenticated) return <OnBoarding />;
  else return <Application />;
}
