import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner-native";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { useFinanceStore } from "@/hooks/stores/useFinanceStore";
import { triggerHaptic } from "~/lib/haptics";

export const useFinanceAuth = () => {
  const { t } = useTranslation("finance");
  const { authenticate } = useBiometricAuth();
  const {
    isAuthenticatedInSession,
    setAuthenticatedInSession,
    setDetailsVisible,
  } = useFinanceStore();
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);

  const authenticateSession = React.useCallback(async (): Promise<boolean> => {
    if (isAuthenticatedInSession) return true;
    if (isAuthenticating) return false;

    setIsAuthenticating(true);
    const result = await authenticate({
      promptMessage: t("biometric_prompt"),
      promptDescription: t("biometric_prompt_description"),
      cancelLabel: t("cancel"),
    });
    setIsAuthenticating(false);

    if (result.success) {
      setAuthenticatedInSession(true);
      setDetailsVisible(true);
      triggerHaptic();
      return true;
    }

    if (result.cancelled) return false;

    toast.error(
      result.error === "not_enrolled"
        ? t("biometric_unavailable")
        : result.error === "missing_usage_description"
          ? t("biometric_faceid_not_configured")
          : t("biometric_failed"),
    );
    return false;
  }, [
    authenticate,
    isAuthenticatedInSession,
    isAuthenticating,
    setAuthenticatedInSession,
    setDetailsVisible,
    t,
  ]);

  return {
    isAuthenticatedInSession,
    isAuthenticating,
    authenticateSession,
  };
};
