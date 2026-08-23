import React from "react";
import { View, StyleSheet } from "react-native";
import { Loader } from "@/components/shared/lotties/Loader";

interface LoaderContextType {
  setLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const LoaderContext = React.createContext<LoaderContextType | undefined>(
  undefined,
);

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setLoading] = React.useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setLoading }}>
      {children}
      {isLoading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999 },
          ]}
          className="justify-center items-center"
        >
          <Loader size="large" />
        </View>
      )}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = React.useContext(LoaderContext);
  if (context === undefined) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};
