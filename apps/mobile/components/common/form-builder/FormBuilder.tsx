import React from "react";
import { View } from "react-native";
import { DynamicForm } from "~/types/utils/form-builder.types";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { RenderInputField } from "./RenderFields";
import { cn } from "~/lib/utils";

interface FormBuilderProps {
  className?: string;
  form: DynamicForm;
  includeHeader?: boolean;
}

export const FormBuilder = ({
  form,
  includeHeader = true,
  className,
}: FormBuilderProps) => {
  return (
    <View className={cn("flex flex-col w-full", className)}>
      {includeHeader && (
        <View className="space-y-1 py-5 sm:py-0">
          <Text className="text-xl font-bold tracking-tight md:text-">
            {form.name}
          </Text>
          <Text className="font-thin mt-2">{form.description}</Text>
        </View>
      )}
      {form?.grids?.map((grid, gridIndex) => (
        <View key={gridIndex}>
          {grid?.gridItems?.map((gridItem) => {
            const fieldCount = gridItem.fields.length;
            return (
              <View
                key={gridItem.id}
                className={cn(
                  "grid gap-6 w-full",
                  form.orientation === "vertical" || fieldCount === 1
                    ? "grid-cols-1"
                    : fieldCount === 2
                    ? "grid-cols-1 lg:grid-cols-2"
                    : fieldCount === 3
                    ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                    : fieldCount === 4
                    ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                    : "w-full"
                )}
              >
                {gridItem.fields.map((field, fieldIndex) => {
                  if (!field.hidden) {
                    return (
                      <View key={fieldIndex}>
                        {field.variant !== "checkbox" && (
                          <Label className="mb-2" htmlFor={field.label}>
                            {field.label}
                            {field.required && (
                              <Text className="text-red-500 dark:text-red-500 font-semibold">
                                {" "}
                                *
                              </Text>
                            )}
                          </Label>
                        )}
                        <RenderInputField field={field} />
                        {field.error && (
                          <Text className="text-red-500 dark:text-red-500 text-xs">
                            {field.error}
                          </Text>
                        )}
                        <Text
                          className={cn(
                            "text-sm text-gray-500 font-thin mb-3 mt-1",
                            field.variant === "picture"
                              ? "text-center"
                              : "text-left"
                          )}
                        >
                          {field.description}
                        </Text>
                      </View>
                    );
                  } else {
                    return null;
                  }
                })}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};
