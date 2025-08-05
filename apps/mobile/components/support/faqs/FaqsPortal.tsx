import { HelpCircle } from "lucide-react-native";
import React from "react";
import { useColorScheme, View } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Text } from "~/components/ui/text";
import Icon from "~/lib/Icon";
import { cn } from "~/lib/utils";

const faqs = [
  {
    question: "How do I apply for a job?",
    answer:
      "Just click on the job card and press the Apply button. You must be logged in to apply.",
  },
  {
    question: "Is it free to create an account?",
    answer: "Yes, creating an account and browsing jobs is completely free.",
  },
  {
    question: "How do I get verified?",
    answer:
      "You can get verified by submitting your profile and linking a valid payment method.",
  },
  {
    question: "Can I favorite jobs?",
    answer: "Yes, tap the heart icon on any job to save it for later.",
  },
];

interface FaqsPortalProps {
  className?: string;
}

export const FaqsPortal = ({ className }: FaqsPortalProps) => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";

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

      <Accordion
        type="multiple"
        collapsible
        className="w-full max-w-sm native:max-w-md"
      >
        {faqs.map((faq, index) => (
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
