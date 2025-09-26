import React from "react";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";

interface StepperProps {
  className?: string;
  steps: React.ReactNode[];
  initialStep?: number;
  forwaredAdditionalActions?: Record<number, () => void>;
  backwordAdditionalActions?: Record<number, () => void>;
  closingAction?: {
    label: string;
    onPress: () => void;
  };
}

export const Stepper = ({
  className,
  steps,
  initialStep = 0,
  forwaredAdditionalActions = {},
  backwordAdditionalActions = {},
  closingAction,
}: StepperProps) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      if (forwaredAdditionalActions[currentStep]) {
        forwaredAdditionalActions[currentStep]();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      if (backwordAdditionalActions[currentStep]) {
        backwordAdditionalActions[currentStep]();
      }
    }
  };

  return (
    <View className={cn("flex flex-col flex-1 justify-between", className)}>
      {/* Step Content */}
      <View className="flex-1 items-center">{steps[currentStep]}</View>

      {/* Controls */}
      <View className="flex-row justify-between px-2 py-4">
        <Button
          disabled={currentStep === 0}
          onPress={prevStep}
          variant="outline"
          className="px-4 py-2 rounded-xl"
        >
          <Text className="font-semibold">Previous</Text>
        </Button>

        <Text className="self-center font-bold text-lg">
          {currentStep + 1} / {steps.length}
        </Text>

        {currentStep === steps.length - 1 && closingAction ? (
          <Button
            onPress={closingAction.onPress}
            className="px-4 py-2 rounded-xl bg-green-600"
          >
            <Text className="font-semibold text-white">
              {closingAction.label}
            </Text>
          </Button>
        ) : (
          <Button onPress={nextStep} className="px-4 py-2 rounded-xl">
            <Text className="font-semibold">Next</Text>
          </Button>
        )}
      </View>
    </View>
  );
};
