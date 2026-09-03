import { View } from "react-native";
import { StableSafeAreaView } from "~/components/shared/stables/StableSafeAreaView";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { TransactionList } from "@/components/finance/transaction/TransactionList";
import { AppHeaderBack } from "../../shared/AppHeaderBack";
import { cn } from "@/lib/utils";

interface TransactionsProps {
  className?: string;
}

export const Transactions = ({ className }: TransactionsProps) => {
  return (
    <StableSafeAreaView
      className={cn("flex flex-1 flex-col bg-card", className)}
    >
      <ApplicationHeader
        title={"All Transactions"}
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

      <View className="flex-1 bg-background p-4">
        <TransactionList />
      </View>
    </StableSafeAreaView>
  );
};
