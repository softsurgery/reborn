import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { auth } from "~/firebase/config";
import { NavigationProps } from "~/types/app.routes";

export const useAuthFunctions = () => {
  const navigation = useNavigation<NavigationProps>();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.clear();
      navigation.replace("index");
    } catch (error) {
      console.error("Sign-out error:", error);
      alert("Error signing out. Please try again.");
    }
  };

  return {
    isAuthenticated,
    handleSignOut,
  };
};
