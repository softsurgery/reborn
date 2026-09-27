import { useCallback } from "react";
import { Platform } from "react-native";
import Constants, { AppOwnership } from "expo-constants";
import * as LocalAuthentication from "expo-local-authentication";

export type BiometricAuthResult =
  | { success: true }
  | { success: false; cancelled: boolean; error?: string };

interface AuthenticateOptions {
  promptMessage: string;
  promptDescription?: string;
  cancelLabel?: string;
  fallbackLabel?: string;
}

const CANCELLED_ERRORS = new Set([
  "user_cancel",
  "system_cancel",
  "app_cancel",
]);

const isExpoGo = Constants.appOwnership === AppOwnership.Expo;

const isFaceIdUnavailable = (
  result: LocalAuthentication.LocalAuthenticationResult,
) => !result.success && Boolean(result.warning);

export const useBiometricAuth = () => {
  const authenticate = useCallback(
    async ({
      promptMessage,
      promptDescription,
      cancelLabel = "Cancel",
      fallbackLabel = "Use passcode",
    }: AuthenticateOptions): Promise<BiometricAuthResult> => {
      if (Platform.OS === "web") {
        return { success: true };
      }

      try {
        const [enrolledLevel, hasHardware, isEnrolled] = await Promise.all([
          LocalAuthentication.getEnrolledLevelAsync(),
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
        ]);

        if (enrolledLevel === LocalAuthentication.SecurityLevel.NONE) {
          return {
            success: false,
            cancelled: false,
            error: "not_enrolled",
          };
        }

        const biometricsAvailable = hasHardware && isEnrolled;
        // Face ID needs a native build with NSFaceIDUsageDescription.
        // Expo Go does not include that, so use the device PIN instead.
        const useFaceId =
          Platform.OS === "ios" && biometricsAvailable && !isExpoGo;

        const runAuth = (useBiometricsOnly: boolean) =>
          LocalAuthentication.authenticateAsync({
            promptMessage,
            promptDescription,
            cancelLabel,
            fallbackLabel: useBiometricsOnly ? "" : fallbackLabel,
            disableDeviceFallback: useBiometricsOnly,
            // Class 2 face unlock on Android is the closest equivalent to Face ID
            biometricsSecurityLevel: "weak",
            requireConfirmation: false,
          });

        let result = await runAuth(useFaceId);

        if (useFaceId && isFaceIdUnavailable(result)) {
          result = await runAuth(false);
        }

        if (result.success) {
          return { success: true };
        }

        return {
          success: false,
          cancelled: CANCELLED_ERRORS.has(result.error),
          error: CANCELLED_ERRORS.has(result.error)
            ? result.error
            : result.warning
              ? "missing_usage_description"
              : result.error,
        };
      } catch (error) {
        return {
          success: false,
          cancelled: false,
          error: error instanceof Error ? error.message : "unknown",
        };
      }
    },
    [],
  );

  return { authenticate };
};
