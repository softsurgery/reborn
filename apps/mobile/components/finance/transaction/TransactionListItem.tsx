import { Text } from "@/components/ui/text";
import { useColorPalette } from "@/hooks/useColorPalette";
import { cn } from "@/lib/utils";
import { FundTransaction, PointTransaction } from "@/types";
import { router } from "expo-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  MoreHorizontal,
} from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface TransactionListItemProps {
  item: PointTransaction | FundTransaction;
}

export const TransactionListItem = ({ item }: TransactionListItemProps) => {
  const { palette } = useColorPalette();
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
    <TouchableOpacity
      className="flex-row justify-between items-center py-2"
      onPress={() =>
        router.push({
          pathname: "/main/finance/transaction",
          params: {
            transaction: JSON.stringify(item),
            type:
              item instanceof FundTransaction
                ? "FundTransaction"
                : "PointTransaction",
          },
        })
      }
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className="p-2 rounded-full bg-muted">
          {getTransactionIcon(item.type)}
        </View>
        <View className="flex-1">
          <Text
            className="font-medium text-sm text-foreground"
            numberOfLines={1}
          >
            {item.metadata?.title
              ? `${item instanceof PointTransaction && item.description ? item.description : item instanceof FundTransaction ? "Fund Transaction" : "Point Transaction"} - ${item.metadata.title}`
              : (item instanceof PointTransaction && item.description
                  ? item.description
                  : null) ||
                (item instanceof FundTransaction
                  ? "Fund Transaction"
                  : "Point Transaction")}
          </Text>
          <View className="flex-row items-center gap-2 mt-1">
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
        {isCredit(item.type) ? "+" : "-"}
        {item.amount} {item instanceof FundTransaction ? "TND" : "Pts"}
      </Text>
    </TouchableOpacity>
  );
};
