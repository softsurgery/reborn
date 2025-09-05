import { HelpCircle } from "lucide-react-native";
import React, { use } from "react";
import { useColorScheme, View } from "react-native";
import { Loader } from "~/components/shared/Loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Text } from "~/components/ui/text";
import { useDataStore } from "~/hooks/content/useDataStore";
import Icon from "~/lib/Icon";
import { cn } from "~/lib/utils";
import { StoreIDs } from "~/types";

interface FaqsPortalProps {
  className?: string;
}

export const FaqsPortal = ({ className }: FaqsPortalProps) => {
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
    <View className={cn("flex flex-col mx-4 my-4 gap-2", className)}>
      {/* Header Section */}
      <View className="mx-auto">
        <Icon name={HelpCircle} />
      </View>
      <View>
        <Text className="font-extrabold">Frequently Asked Questions</Text>
        <Text className="font-thin mt-2">
          Find quick answers to common questions and get the support you need.
        </Text>
      </View>

      <Accordion type="multiple" collapsible className="w-full">
        {dataStore?.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger>
              <Text className="text-xl font-medium">{faq.question}</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text className="text-lg text-gray-500 dark:text-gray-300">
                {faq.answer}
              </Text>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </View>
  );
};
