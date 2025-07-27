import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SignInPayload } from "~/types/auth.types";
import { useNavigation } from "expo-router";
import { CommonActions } from "@react-navigation/native";

type AuthContextType = {
  payload: SignInPayload | null;
  isAuthenticated: boolean;
  setPayload: (payload: SignInPayload | null) => void;
  disconnect: () => void;
  loading: boolean;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [payload, setPayloadState] = React.useState<SignInPayload | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const loadPayload = async () => {
      try {
        const storedPayload = await AsyncStorage.getItem("authPayload");
        if (storedPayload) {
          setPayloadState(JSON.parse(storedPayload));
        }
      } catch (error) {
        console.error("Failed to load auth payload from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPayload();
  }, []);

  const setPayload = async (payload: SignInPayload | null) => {
    try {
      if (payload) {
        await AsyncStorage.setItem("authPayload", JSON.stringify(payload));
      } else {
        await AsyncStorage.removeItem("authPayload");
      }
      setPayloadState(payload);
    } catch (error) {
      console.error("Failed to update auth payload in AsyncStorage:", error);
    }
  };

  const disconnect = async () => {
    try {
      AsyncStorage.removeItem("authPayload");
      setPayloadState(null);
    } catch (error) {
      console.error("Failed to clear auth payload during disconnect:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        payload,
        isAuthenticated: !!payload,
        setPayload,
        disconnect,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
