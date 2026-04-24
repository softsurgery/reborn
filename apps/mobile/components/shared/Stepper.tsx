import React from "react";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { StableKeyboardAwareScrollView } from "./StableKeyboardAwareScrollView";
import { useKeyboardVisible } from "~/hooks/useKeyboardVisible";
import { cn } from "~/lib/utils";
import { Icon } from "../ui/icon";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

interface StepperProps {
  classNames?: {
    wrapper?: string;
    controlsWrapper?: string;
  };
  steps: {
    title?: string;
    description?: string;
    component: React.ReactNode;
    validation: boolean | (() => boolean);
  }[];
  initialStep?: number;
  forwaredAdditionalActions?: Record<number, () => void>;
  backwordAdditionalActions?: Record<number, () => void>;
  closingAction?: {
    label: string;
    onPress: () => void;
  };
}

export const Stepper = ({
  classNames,
  steps,
  initialStep = 0,
  forwaredAdditionalActions = {},
  backwordAdditionalActions = {},
  closingAction,
}: StepperProps) => {
  const isKeyboardVisible = useKeyboardVisible();
  const [currentStep, setCurrentStep] = React.useState(initialStep);

  const runValidation = React.useCallback(
    (stepIndex: number) => {
      const validation = steps[stepIndex]?.validation;

      return typeof validation === "function" ? validation() : validation;
    },
    [steps],
  );

  const nextStep = () => {
    const isValid = runValidation(currentStep);

    // 🚫 block navigation if invalid
    if (!isValid) return;

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

  const isLastStep = currentStep === steps.length - 1;

  return (
    <React.Fragment>
      {/* Step Content */}
      <StableKeyboardAwareScrollView className="flex-1">
        <View className="px-2 py-4">
          {steps[currentStep].title && (
            <Text className="text-lg font-semibold">
              {steps[currentStep].title}
            </Text>
          )}

          {steps[currentStep].description && (
            <Text className="text-sm text-muted-foreground">
              {steps[currentStep].description}
            </Text>
          )}
        </View>

        {steps[currentStep].component}
      </StableKeyboardAwareScrollView>

      {/* Controls */}
      {!isKeyboardVisible && (
        <View
          className={cn(
            "flex-row justify-between px-2 py-4 bg-muted border-t border-border",
            classNames?.controlsWrapper,
          )}
        >
          {/* Previous */}
          <Button
            disabled={currentStep === 0}
            onPress={prevStep}
            variant="outline"
            className="px-4 py-2 rounded-xl"
          >
            <Icon as={ArrowLeft} size={20} />
            <Text className="font-semibold">Previous</Text>
          </Button>

          {/* Next / Finish */}
          {isLastStep && closingAction ? (
            <Button
              size="sm"
              onPress={closingAction.onPress}
              className="rounded-xl bg-green-600"
            >
              <Text className="font-semibold">{closingAction.label}</Text>
            </Button>
          ) : (
            <Button size="sm" onPress={nextStep} className="rounded-xl">
              <Text className="font-semibold">Next</Text>
              <Icon as={ArrowRight} size={20} />
            </Button>
          )}
        </View>
      )}
    </React.Fragment>
  );
};
