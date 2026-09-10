import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { FundTransaction, PointTransaction } from "@/types";
import { router } from "expo-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  MoreHorizontal,
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useRTL } from "~/hooks/useRTL";

import { useFinanceStore } from "@/hooks/stores/useFinanceStore";
import { useFinanceAuth } from "@/hooks/content/finance/useFinanceAuth";

interface TransactionListItemProps {
  className?: string;
  item: PointTransaction | FundTransaction;
}

export const TransactionListItem = ({
  className,
  item,
}: TransactionListItemProps) => {
  const { t } = useTranslation("finance");
  const isRTL = useRTL();
  const { detailsVisible } = useFinanceStore();
  const { authenticateSession, isAuthenticating } = useFinanceAuth();

  const handlePress = async () => {
    const success = await authenticateSession();
    if (success) {
      router.push({
        pathname: "/main/finance/transaction",
        params: {
          transaction: JSON.stringify(item),
          type:
            item instanceof FundTransaction
              ? "FundTransaction"
              : "PointTransaction",
        },
      });
    }
  };

  const isCredit = (type?: string) => {
    if (!type) return false;
    return [
      "CREDIT",
      "BOUGHT_VIA_CREDIT_CARD",
      "RECEIVED_PAYMENT",
      "APPLICATION_FEE_REFUNDED",
    ].includes(type);
  };

  const isDebit = (type?: string) => {
    if (!type) return false;
    return ["DEBIT", "APPLYING_FOR_JOB"].includes(type);
  };

  const getTransactionIcon = (type?: string) => {
    if (isCredit(type)) {
      return <ArrowUpRight size={18} color="#16a34a" />;
    }
    if (isDebit(type)) {
      return <ArrowDownLeft size={18} color="#dc2626" />;
    }
    return <MoreHorizontal size={18} color="#6b7280" />;
  };

  return (
    <Pressable
      className={cn(
        "flex-row gap-4 justify-between items-center py-2 active:opacity-50",
        isRTL && "flex-row-reverse",
        className,
      )}
      onPress={handlePress}
      disabled={isAuthenticating}
    >
      <View
        className={cn(
          "flex-row items-center gap-3 flex-1",
          isRTL && "flex-row-reverse",
        )}
      >
        <View className="p-2 rounded-full bg-muted">
          {getTransactionIcon(item.type)}
        </View>
        <View className="flex-1">
          <Text
            className="font-medium text-sm text-foreground"
            numberOfLines={1}
          >
            {item.metadata?.title
              ? `${item instanceof PointTransaction && item.description ? item.description : item instanceof FundTransaction ? t("fund_transaction") : t("point_transaction")} - ${item.metadata.title}`
              : (item instanceof PointTransaction && item.description
                  ? item.description
                  : null) ||
                (item instanceof FundTransaction
                  ? t("fund_transaction")
                  : t("point_transaction"))}
          </Text>
          <View
            className={cn(
              "flex-row items-center gap-2 mt-1",
              isRTL && "flex-row-reverse",
            )}
          >
            <Calendar size={12} color="#6b7280" />
            <Text className="text-xs text-muted-foreground">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      <Text
        className={cn(
          "font-semibold text-base",
          isCredit(item.type) && "text-green-600",
          isDebit(item.type) && "text-red-600",
        )}
      >
        {detailsVisible ? (
          <>
            {isCredit(item.type) ? "+" : "-"}
            {item.amount} {item instanceof FundTransaction ? t("tnd") : t("pts")}
          </>
        ) : (
          "••••"
        )}
      </Text>
    </Pressable>
  );
};
