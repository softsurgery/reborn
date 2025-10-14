import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import {
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building2,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  User,
  Bell,
} from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";

interface Transaction {
  id: string;
  type: "earning" | "withdrawal" | "fee";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "earning",
    description: "Website Development Project",
    amount: 2500.0,
    date: "2024-01-15",
    status: "pending",
  },
  {
    id: "2",
    type: "withdrawal",
    description: "Bank Transfer",
    amount: -1200.0,
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: "3",
    type: "earning",
    description: "Mobile App UI Design",
    amount: 1800.0,
    date: "2024-01-12",
    status: "completed",
  },
  {
    id: "4",
    type: "fee",
    description: "Platform Service Fee",
    amount: -45.0,
    date: "2024-01-12",
    status: "failed",
  },
  {
    id: "5",
    type: "earning",
    description: "Logo Design Project",
    amount: 650.0,
    date: "2024-01-10",
    status: "pending",
  },
];

interface BalanceProps {
  className?: string;
}

export const Balance = ({ className }: BalanceProps) => {
  const navigation = useNavigation<NavigationProps>();
  const totalEarnings = 28750.0;
  const availableBalance = 15420.0;
  const pendingAmount = 2450.0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "earning":
        return <ArrowUpRight size={18} color="#16a34a" />;
      case "withdrawal":
        return <ArrowDownLeft size={18} color="#dc2626" />;
      case "fee":
        return <MoreHorizontal size={18} color="#6b7280" />;
    }
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    if (status === "completed")
      return (
        <Badge variant="default">
          <Text>{label}</Text>
        </Badge>
      );
    if (status === "pending")
      return (
        <Badge variant="secondary">
          <Text>{label}</Text>
        </Badge>
      );
    if (status === "failed")
      return (
        <Badge variant="destructive">
          <Text>{label}</Text>
        </Badge>
      );
  };

  return (
    <StableSafeAreaView className={cn("flex-1 mx-2", className)}>
      <ApplicationHeader
        title="Balance"
        shortcuts={[
          {
            icon: User,
            onPress: () => navigation.navigate("my-space/index", {}),
          },
          {
            icon: Bell,
            onPress: () => navigation.navigate("my-space/index", {}),
          },
        ]}
      />
      {/* Balance Overview */}
      <View className="p-4 gap-4">
        <View className="items-center">
          <Text className="text-3xl font-bold text-foreground">
            {formatCurrency(availableBalance)}
          </Text>
          <Text className="text-sm text-muted-foreground mt-1">
            Ready to withdraw
          </Text>
        </View>

        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-lg font-semibold text-foreground">
              {formatCurrency(totalEarnings)}
            </Text>
            <Text className="text-xs text-muted-foreground">Total Earned</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-lg font-semibold text-amber-600">
              {formatCurrency(pendingAmount)}
            </Text>
            <Text className="text-xs text-muted-foreground">Pending</Text>
          </View>
        </View>

        <Button className="flex flex-row gap-2 w-full">
          <ArrowDownLeft size={16} className="mr-2" color={"white"} />
          <Text>Withdraw Funds</Text>
        </Button>
      </View>

      {/* Withdrawal Methods */}
      <View className="p-4 gap-4">
        <TouchableOpacity className="flex-row items-center justify-between p-3 rounded-lg border border-border">
          <View className="flex-row items-center gap-3">
            <View className="p-2 rounded-full bg-primary/10">
              <Building2 size={16} color="#2563eb" />
            </View>
            <View>
              <Text className="font-medium text-sm text-foreground">
                Bank Transfer
              </Text>
              <Text className="text-xs text-muted-foreground">
                1-3 business days
              </Text>
            </View>
          </View>
          <Badge variant="secondary">
            <Text>Primary</Text>
          </Badge>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-3 rounded-lg border border-border">
          <View className="flex-row items-center gap-3">
            <View className="p-2 rounded-full bg-blue-100">
              <CreditCard size={16} color="#2563eb" />
            </View>
            <View>
              <Text className="font-medium text-sm text-foreground">
                PayPal
              </Text>
              <Text className="text-xs text-muted-foreground">
                Instant transfer
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View className="p-4 space-y-3">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center gap-2">
            <TrendingUp size={20} color="#2563eb" />
            <Text className="text-lg font-semibold text-black dark:text-white">
              Recent Activity
            </Text>
          </View>
          <Button variant="ghost" size="sm">
            <Text className="text-muted-foreground">View All</Text>
          </Button>
        </View>

        <FlatList
          data={mockTransactions.slice(0, 4)}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Separator className="my-2" />}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center py-2">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="p-2 rounded-full bg-muted">
                  {getTransactionIcon(item.type)}
                </View>
                <View className="flex-1">
                  <Text
                    className="font-medium text-sm text-foreground"
                    numberOfLines={1}
                  >
                    {item.description}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Calendar size={12} color="#6b7280" />
                    <Text className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                    {getStatusBadge(item.status)}
                  </View>
                </View>
              </View>
              <Text
                className={cn(
                  "font-semibold text-sm",
                  item.type === "earning" && "text-green-600",
                  item.type === "withdrawal" && "text-red-600",
                  item.type === "fee" && "text-muted-foreground"
                )}
              >
                {item.type === "earning" ? "+" : ""}
                {formatCurrency(item.amount)}
              </Text>
            </View>
          )}
        />
      </View>
    </StableSafeAreaView>
  );
};
