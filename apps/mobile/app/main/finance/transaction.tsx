import { useLocalSearchParams } from "expo-router";
import { TransactionDetails } from "@/components/finance/transaction/TransactionDetails";

export default function Screen() {
  const { id } = useLocalSearchParams();

  return <TransactionDetails id={Number(id)} />;
}
