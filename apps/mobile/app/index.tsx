import React from "react";
import OnBoarding from "~/components/OnBoarding";
import Application from "~/components/Application";
import { useAuth } from "~/context/AuthContext";
import { Loader } from "~/components/Loader";
import { useDebounce } from "~/hooks/useDebounce";

export default function Screen() {
  const { isAuthenticated, loading } = useAuth();
  const { loading: debouncedLoading } = useDebounce(loading, 200);

  if (debouncedLoading) {
    return <Loader />;
  }

  // Render based on authentication state
  return isAuthenticated ? <Application /> : <OnBoarding />;
}
