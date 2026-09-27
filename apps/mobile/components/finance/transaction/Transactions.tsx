import { View } from "react-native";
import { StableSafeAreaView } from "~/components/shared/stables/StableSafeAreaView";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { TransactionList } from "@/components/finance/transaction/TransactionList";
import { AppHeaderBack } from "../../shared/AppHeaderBack";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface TransactionsProps {
  className?: string;
}

export const Transactions = ({ className }: TransactionsProps) => {
  const { t } = useTranslation("finance");

  return (
    <StableSafeAreaView
      className={cn("flex flex-1 flex-col bg-card", className)}
    >
      <ApplicationHeader
        title={t("all_transactions")}
        titleVariant="large"
        classNames={{ wrapper: "border-b border-border pb-2" }}
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
        reverse
      />

      <View className="flex-1 bg-background">
        <TransactionList
          classNames={{ wrapper: "flex-1 pt-2 pb-8", item: "mx-4" }}
        />
      </View>
    </StableSafeAreaView>
  );
};
