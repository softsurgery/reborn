import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { CreditCard, Building2, Coins, Wallet } from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Text } from "~/components/ui/text";
import { useBalance } from "~/hooks/content/finance/useFinance";
import { useColorPalette } from "~/hooks/useColorPalette";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface FinanceOverviewTabProps {
  className?: string;
}

export const FinanceOverviewTab = ({ className }: FinanceOverviewTabProps) => {
  const { palette } = useColorPalette();
  const { t } = useTranslation("finance");
  const { data: balanceData, isLoading: isLoadingBalance } = useBalance();

  const currentPoints = Number(balanceData?.points || 0);
  const currentBalance = Number(balanceData?.balance || 0);

  return (
    <View className={cn("flex-1 bg-background p-4 gap-4", className)}>
      <View className="flex-row justify-between gap-4">
        {/* Wallet Balance */}
        <View className="flex-1  rounded-xl p-4 border border-border items-center">
          <View className="p-3 rounded-full bg-primary/10 mb-2">
            <Wallet size={24} color={palette.primary} />
          </View>
          {isLoadingBalance ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text className="text-2xl font-bold text-foreground">
              ${currentBalance.toFixed(2)}
            </Text>
          )}
          <Text className="text-xs text-muted-foreground mt-1">{t("real_money", "Real Money")}</Text>
        </View>

        {/* Points Balance */}
        <View className="flex-1  rounded-xl p-4 border border-border items-center">
          <View className="p-3 rounded-full bg-amber-500/10 mb-2">
            <Coins size={24} color="#f59e0b" />
          </View>
          {isLoadingBalance ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text className="text-2xl font-bold text-foreground">
              {currentPoints}
            </Text>
          )}
          <Text className="text-xs text-muted-foreground mt-1">{t("points", "Points")}</Text>
        </View>
      </View>

      <Button className="flex flex-row gap-2 w-full mt-2">
        <CreditCard size={16} className="mr-2" color={"white"} />
        <Text>{t("add_funds", "Add Funds")}</Text>
      </Button>

      {/* Payment Methods */}
      <View className="gap-4 mt-4">
        <Text className="text-lg font-semibold text-foreground">
          {t("payment_methods", "Payment Methods")}
        </Text>
        <TouchableOpacity className="flex-row items-center justify-between p-3 rounded-lg border border-border">
          <View className="flex-row items-center gap-3">
            <View className="p-2 rounded-full bg-primary/10">
              <CreditCard size={16} color={palette.primary} />
            </View>
            <View>
              <Text className="font-medium text-sm text-foreground">
                {t("visa_ending", "Visa ending in 4242")}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {t("expires", "Expires 12/28")}
              </Text>
            </View>
          </View>
          <Badge variant="secondary">
            <Text>{t("primary", "Primary")}</Text>
          </Badge>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-3 rounded-lg border border-border">
          <View className="flex-row items-center gap-3">
            <View className="p-2 rounded-full bg-muted">
              <Building2 size={16} color={palette.primary} />
            </View>
            <View>
              <Text className="font-medium text-sm text-foreground">
                {t("add_new_method", "Add new method")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
