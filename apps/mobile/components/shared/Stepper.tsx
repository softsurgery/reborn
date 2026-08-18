import React from "react";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { StableKeyboardAwareScrollView } from "./StableKeyboardAwareScrollView";
import { useKeyboardVisible } from "~/hooks/useKeyboardVisible";
import { cn } from "~/lib/utils";
import { Icon } from "../ui/icon";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { type VariantProps } from "class-variance-authority";
import { useTranslation } from "react-i18next";

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
  closingActions?: {
    id?: string | number;
    label: string;
    className?: string;
    variant?: VariantProps<typeof Button>["variant"];
    onPress: () => void;
    disabled?: boolean;
  }[];
  pending?: boolean;
  placeholders?: {
    nextLabel: string;
    previousLabel: string;
  };
}

export const Stepper = ({
  classNames,
  steps,
  initialStep = 0,
  forwaredAdditionalActions = {},
  backwordAdditionalActions = {},
  closingActions = [],
  pending = false,
  placeholders,
}: StepperProps) => {
  const { t } = useTranslation("common");
  const isKeyboardVisible = useKeyboardVisible();
  const [currentStep, setCurrentStep] = React.useState(initialStep);

  const runValidation = React.useCallback(
    (stepIndex: number) => {
      const validation = steps[stepIndex]?.validation;

      return typeof validation === "function" ? validation() : validation;
    },
    [steps],
  );

  // Function validators may call setState (e.g. form error stores). Never
  // invoke them during render — only booleans are safe for the disabled flag.
  const isCurrentStepReady = React.useMemo(() => {
    const validation = steps[currentStep]?.validation;
    if (typeof validation === "function") return true;
    return validation !== false;
  }, [steps, currentStep]);

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
            "flex-row p-4 bg-muted border-t border-border",
            currentStep === 0 ? "justify-end" : "justify-between",
            classNames?.controlsWrapper,
          )}
        >
          {/* Previous */}
          <Button
            size="sm"
            disabled={pending}
            onPress={prevStep}
            variant="outline"
            className={cn(
              "px-4 py-2 rounded-xl",
              currentStep === 0 ? "hidden" : "block",
            )}
          >
            <Icon as={ChevronLeft} size={20} />
            <Text className="font-semibold">
              {placeholders?.previousLabel || t("actions.previous")}
            </Text>
          </Button>

          {/* Next / Finish */}

          {isLastStep && closingActions.length > 0 ? (
            <View className="flex-row gap-2">
              {closingActions.map((closingAction, index) => (
                <Button
                  key={closingAction.id ?? `closing-action-${index}`}
                  variant={closingAction.variant}
                  onPress={closingAction.onPress}
                  disabled={
                    closingAction.disabled || pending || !isCurrentStepReady
                  }
                  className={cn(
                    "px-4 py-2 rounded-xl",
                    closingAction.className,
                  )}
                >
                  <Text className="font-semibold">{closingAction.label}</Text>
                </Button>
              ))}
            </View>
          ) : (
            <Button
              onPress={nextStep}
              className={cn("px-4 py-2 rounded-xl")}
              disabled={pending || !isCurrentStepReady}
            >
              <Text className="font-semibold">
                {placeholders?.nextLabel || t("actions.next")}
              </Text>
              <Icon as={ChevronRight} size={20} />
            </Button>
          )}
        </View>
      )}
    </React.Fragment>
  );
};
