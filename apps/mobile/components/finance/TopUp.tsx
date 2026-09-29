import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@reborn/mobile-ui";
import { Input } from "@reborn/mobile-ui";
import { Text } from "@reborn/mobile-ui";
import { Tabs, TabsList, TabsTrigger } from "@reborn/mobile-ui";
import { useTranslation } from "react-i18next";
import { ApplicationHeader } from "@reborn/mobile-components";
import { StableSafeAreaView } from "@reborn/mobile-components";
import { StableKeyboardAwareScrollView } from "@reborn/mobile-components";
import { BottomButtonWrapper } from "@reborn/mobile-components";
import { AppHeaderBack } from "@reborn/mobile-components";
import { useKeyboardVisible } from "@reborn/mobile-components";
import * as Haptics from "expo-haptics";
import { Icon } from "@reborn/mobile-ui";
import { Loader2 } from "lucide-react-native";
import { useTopUpFunds } from "@/hooks/content/finance/useTopUpFunds";
import { useTopUpPoints } from "@/hooks/content/finance/useTopUpPoints";

interface TopUpProps {
  className?: string;
}

export const TopUp = ({ className }: TopUpProps) => {
  const { t } = useTranslation("finance");
  const router = useRouter();
  const [type, setType] = useState<"funds" | "points">("funds");
  const [amount, setAmount] = useState("");
  const isKeyboardVisible = useKeyboardVisible();

  const topUpFundsMutation = useTopUpFunds();
  const topUpPointsMutation = useTopUpPoints();

  const isPending =
    topUpFundsMutation.isPending || topUpPointsMutation.isPending;

  const handleSubmit = async () => {
    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) return;

    if (type === "funds") {
      await topUpFundsMutation.mutateAsync(numAmount);
    } else {
      await topUpPointsMutation.mutateAsync(numAmount);
    }

    setAmount("");
    router.back();
  };

  return (
    <StableSafeAreaView className="flex-1 bg-card">
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        title={"Top Up Balance"}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
      />
      <StableKeyboardAwareScrollView className="flex-1 bg-background">
        <View className="p-4 gap-6">
          <Text className="text-sm text-muted-foreground">
            {t(
              "top_up_description",
              "Add funds or points to your Reborn account securely.",
            )}
          </Text>

          <Tabs
            value={type}
            onValueChange={(val) => setType(val as "funds" | "points")}
            className="w-full"
          >
            <TabsList className="w-full flex-row h-12">
              <TabsTrigger value="funds" className="flex-1 h-full">
                <Text>Add Funds</Text>
              </TabsTrigger>
              <TabsTrigger value="points" className="flex-1 h-full">
                <Text>Add Points</Text>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <View className="gap-2 mt-4">
            <Text className="text-sm font-medium text-foreground">
              {type === "funds"
                ? t("amount_tnd", "Amount (TND)")
                : t("amount_points", "Amount (Points)")}
            </Text>
            <Input
              value={amount}
              onChangeText={setAmount}
              placeholder={type === "funds" ? "0.00" : "100"}
              keyboardType="numeric"
              className="w-full text-lg p-4"
            />
          </View>
        </View>
      </StableKeyboardAwareScrollView>
      {!isKeyboardVisible && (
        <BottomButtonWrapper>
          <Button
            size="lg"
            className="rounded-xl w-full flex-row"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleSubmit();
            }}
            disabled={!amount || isPending}
          >
            {isPending ? (
              <React.Fragment>
                <Icon
                  as={Loader2}
                  size={18}
                  className="text-primary-foreground animate-spin mr-2"
                />
                <Text className="text-primary-foreground font-semibold">
                  {t("processing", "Processing...")}
                </Text>
              </React.Fragment>
            ) : (
              <Text className="text-md font-bold">Pay Now</Text>
            )}
          </Button>
        </BottomButtonWrapper>
      )}
    </StableSafeAreaView>
  );
};
