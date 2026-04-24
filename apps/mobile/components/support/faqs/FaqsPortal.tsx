import React from "react";
import { ArrowLeft } from "lucide-react-native";
import { View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { ApplicationHeader } from "~/components/shared/AppHeader";
import { Loader } from "~/components/shared/Loader";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Text } from "~/components/ui/text";

import { useDataStore } from "~/hooks/content/useDataStore";
import { cn } from "~/lib/utils";
import { StoreIDs } from "~/types";
import { StableScrollView } from "~/components/shared/StableScrollView";

interface FaqsPortalProps {
  className?: string;
}

export const FaqsPortal = ({ className }: FaqsPortalProps) => {
  const { t } = useTranslation("common");

  const { dataStore, isDataStorePending } = useDataStore<
    {
      question: string;
      answer: string;
    }[]
  >({
    id: StoreIDs.FAQS,
  });

  if (isDataStorePending) return <Loader />;

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        className="border-b border-border pb-2"
        title={t("screens.faqs")}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            icon: ArrowLeft,
            onPress: () => router.back(),
          },
        ]}
      />

      <StableScrollView
        showsVerticalScrollIndicator={false}
        className="bg-background"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-6 py-6">
          <View className="mb-6 gap-2">
            <Text className="text-muted-foreground text-base leading-relaxed">
              Find quick answers to common questions and get the support you
              need.
            </Text>
          </View>

          <Accordion type="multiple" collapsible className="w-full">
            {dataStore?.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border-b border-border py-2"
              >
                <AccordionTrigger className="py-4">
                  <Text className="text-lg font-semibold text-foreground text-left">
                    {faq.question}
                  </Text>
                </AccordionTrigger>

                <AccordionContent>
                  <Text className="text-base text-muted-foreground leading-7 pb-4">
                    {faq.answer}
                  </Text>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </View>
      </StableScrollView>
    </StableSafeAreaView>
  );
};
