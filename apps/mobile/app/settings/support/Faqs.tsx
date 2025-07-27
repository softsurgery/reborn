import React, { useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react-native";
import { Separator } from "~/components/ui/separator";
import { StableScrollView } from "~/components/common/StableScrollView";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
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

export default function Faqs() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";

  const toggleExpand = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <StableScrollView className="flex flex-col mx-4 my-4 gap-2">
      <View className="items-center mx-auto mb-6">
        <HelpCircle size={32} color={iconColor} />
      </View>
      <View className="py-5 space-y-1">
        <Text className="text-2xl font-bold text-black dark:text-white">Frequently Asked Questions</Text>
        <Text className="text-muted-foreground">
          Find quick answers to common questions and get the support you need.
        </Text>
        <Separator className="my-2" />
      </View>
      {faqs.map((faq, index) => (
        <View key={index} className="mb-4">
          <TouchableOpacity
            onPress={() => toggleExpand(index)}
            className="flex-row justify-between items-center py-2 px-1"
          >
            <Text className="text-base font-medium underline text-black dark:text-white">
              {faq.question}
            </Text>
            {expandedIndex === index ? (
              <ChevronUp size={20} color={iconColor} />
            ) : (
              <ChevronDown size={20} color={iconColor} />
            )}
          </TouchableOpacity>
          {expandedIndex === index && (
            <View className="px-3 py-2 rounded-b-md">
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                {faq.answer}
              </Text>
            </View>
          )}
        </View>
      ))}
    </StableScrollView>
  );
}
