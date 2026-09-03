import { View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { StableSafeAreaView } from "~/components/shared/stables/StableSafeAreaView";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { PointTransaction, FundTransaction } from "@/types";
import { AppHeaderBack } from "@/components/shared/AppHeaderBack";

interface TransactionDetailsProps {
  className?: string;
  id: number;
}

export const TransactionDetails = ({ className }: TransactionDetailsProps) => {
  const params = useLocalSearchParams();
  const transactionString = params.transaction as string;
  let transaction: PointTransaction | FundTransaction | null = null;

  try {
    if (transactionString) {
      const parsed = JSON.parse(transactionString);
      if (params.type === "FundTransaction") {
        transaction = new FundTransaction(parsed);
      } else {
        transaction = new PointTransaction(parsed);
      }
    }
  } catch (e) {
    console.error("Failed to parse transaction data:", e);
  }

  if (!transaction) {
    return (
      <StableSafeAreaView
        className={cn("flex flex-1 flex-col bg-background", className)}
      >
        <ApplicationHeader title="Transaction Details" />
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-muted-foreground">
            Transaction details not found.
          </Text>
        </View>
      </StableSafeAreaView>
    );
  }

  const isCredit = (type: PointTransaction["type"]) => {
    return [
      "CREDIT",
      "BOUGHT_VIA_CREDIT_CARD",
      "RECEIVED_PAYMENT",
      "APPLICATION_FEE_REFUNDED",
    ].includes(type as string);
  };

  const isDebit = (type: PointTransaction["type"]) => {
    return ["DEBIT", "APPLYING_FOR_JOB"].includes(type as string);
  };

  const credit = isCredit(transaction.type);
  const debit = isDebit(transaction.type);

  return (
    <StableSafeAreaView className="flex flex-1 flex-col bg-card">
      <ApplicationHeader
        title="Transaction Details"
        titleVariant="large"
        classNames={{ wrapper: "border-b border-border pb-2 bg-transparent" }}
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
        reverse
      />

      <ScrollView className="flex-1 p-4 bg-background">
        <View className="items-center py-6">
          <Text className="text-sm text-muted-foreground uppercase mb-2">
            Amount
          </Text>
          <Text
            className={cn(
              "text-4xl font-bold",
              credit && "text-green-600",
              debit && "text-red-600",
            )}
          >
            {credit ? "+" : "-"}
            {transaction.amount}{" "}
            {transaction instanceof FundTransaction ? "TND" : "Pts"}
          </Text>
        </View>

        <View className="bg-card border border-border rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between py-3 border-b border-border/50">
            <Text className="text-muted-foreground">ID</Text>
            <Text className="font-medium text-foreground">
              {transaction.id}
            </Text>
          </View>
          <View className="flex-row justify-between py-3 border-b border-border/50">
            <Text className="text-muted-foreground">Type</Text>
            <Text className="font-medium text-foreground">
              {transaction.type}
            </Text>
          </View>
          <View className="flex-row justify-between py-3 border-b border-border/50">
            <Text className="text-muted-foreground">Date</Text>
            <Text className="font-medium text-foreground">
              {new Date(transaction.createdAt).toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between py-3">
            <Text className="text-muted-foreground">Description</Text>
            <Text className="font-medium text-foreground text-right flex-1 ml-4">
              {(transaction instanceof PointTransaction &&
                transaction.description) ||
                "N/A"}
            </Text>
          </View>
        </View>

        {transaction.metadata &&
          Object.keys(transaction.metadata).length > 0 && (
            <View className="bg-card border border-border rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-foreground mb-4">
                Additional Details
              </Text>
              {Object.entries(transaction.metadata).map(
                ([key, value], index) => {
                  const isLast =
                    index === Object.keys(transaction.metadata!).length - 1;
                  return (
                    <View
                      key={key}
                      className={cn(
                        "flex-row justify-between py-3",
                        !isLast && "border-b border-border/50",
                      )}
                    >
                      <Text className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Text>
                      <Text className="font-medium text-foreground text-right flex-1 ml-4">
                        {String(value)}
                      </Text>
                    </View>
                  );
                },
              )}
            </View>
          )}
      </ScrollView>
    </StableSafeAreaView>
  );
};
