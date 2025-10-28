import React from "react";
import { View, Text } from "react-native";

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.warn("Caught error:", error, info);
  }

  render() {
    return this.props.children;
  }
}

export default AppErrorBoundary;
