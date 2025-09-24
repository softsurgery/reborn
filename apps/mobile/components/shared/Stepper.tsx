import React from "react";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";

interface StepperProps {
  className?: string;
  steps: React.ReactNode[];
  initialStep?: number;
}

export const Stepper = ({
  className,
  steps,
  initialStep = 0,
}: StepperProps) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep);

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <View className={cn("flex-1 flex flex-col justify-between", className)}>
      {/* Step Content */}
      <View className="flex-1 items-center">{steps[currentStep]}</View>

      {/* Controls */}
      <View className="flex-row justify-between px-6 py-4">
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

        <Button
          disabled={currentStep === steps.length - 1}
          onPress={nextStep}
          className="px-4 py-2 rounded-xl"
        >
          <Text className="font-semibold">Next</Text>
        </Button>
      </View>
    </View>
  );
};
