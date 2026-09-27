import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { AlertCircle, CheckCircle2, Wallet } from "lucide-react-native";
import { router } from "expo-router";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";

interface BudgetWarningProps {
  requiredAmount?: number;
  currentBalance?: number;
  isPending?: boolean;
}

export const BudgetWarning = ({
  requiredAmount = 0,
  currentBalance = 0,
  isPending = false,
}: BudgetWarningProps) => {
  const { t } = useTranslation("jobs");

  if (isPending) return null;
  if (!requiredAmount || requiredAmount <= 0) return null;

  const hasEnough = currentBalance >= requiredAmount;

  return (
    <View
      className={cn(
        "mt-4 p-4 rounded-xl border",
        hasEnough
          ? "bg-emerald-500/10 border-emerald-500/20"
          : "bg-rose-500/10 border-rose-500/20"
      )}
    >
      <View className="flex-row items-start gap-3">
        <Icon
          as={hasEnough ? CheckCircle2 : AlertCircle}
          size={20}
          className={hasEnough ? "text-emerald-600" : "text-rose-600"}
        />
        <View className="flex-1">
          <Text
            className={cn(
              "font-semibold",
              hasEnough ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
            )}
          >
            {hasEnough
              ? t("form.budget.sufficientTitle")
              : t("form.budget.insufficientTitle")}
          </Text>
          <Text
            className={cn(
              "text-sm mt-1",
              hasEnough ? "text-emerald-700/80 dark:text-emerald-400/80" : "text-rose-700/80 dark:text-rose-400/80"
            )}
          >
            {hasEnough
              ? t("form.budget.sufficient", {
                  amount: requiredAmount.toLocaleString(),
                })
              : t("form.budget.insufficient", {
                  required: requiredAmount.toLocaleString(),
                  current: currentBalance.toLocaleString(),
                })}
          </Text>

          {!hasEnough && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-32 border-rose-500/30"
              onPress={() => router.push("/main/finance/topup")}
            >
              <Icon as={Wallet} size={16} className="text-rose-600 mr-2" />
              <Text className="text-rose-600 font-semibold">
                {t("form.budget.topUp")}
              </Text>
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};
