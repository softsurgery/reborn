import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
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
  const { width: screenWidth } = useWindowDimensions();

  // Define breakpoint (e.g. tablets or wide screens)
  const isWideScreen = screenWidth >= 600;

  return (
    <View className={cn("flex flex-col w-full", className)}>
      {includeHeader && (
        <View className="space-y-1 py-5">
          <Text className="text-xl font-bold tracking-tight">
            {form.name}
          </Text>
          <Text className="font-thin mt-2">{form.description}</Text>
        </View>
      )}

      {form?.grids?.map((grid, gridIndex) => (
        <View key={gridIndex} className="mb-6">
          {grid.includeHeader && (
            <View className="mb-4">
              <Text className="text-lg font-semibold">{grid.name}</Text>
              <View className="h-[1px] bg-gray-300 my-2" />
            </View>
          )}

          {grid?.gridItems?.map((gridItem) => {
            const isVertical = form.orientation === "vertical";
            const fieldCount = gridItem.fields.length;

            return (
              <View key={gridItem.id} className="mb-6">
                <View
                  className={cn(
                    "flex flex-wrap justify-between w-full gap-4",
                    isVertical ? "flex-col" : "flex-row"
                  )}
                >
                  {gridItem.fields.map((field, fieldIndex) => {
                    if (field.hidden) return null;

                    // Dynamic width based on screen size and field count
                    const dynamicStyle =
                      !isVertical && fieldCount > 1
                        ? isWideScreen
                          ? styles.halfWidthField
                          : styles.fullWidthField
                        : styles.fullWidthField;

                    return (
                      <View key={fieldIndex} style={dynamicStyle}>
                        {field.variant !== "checkbox" && (
                          <Label className="mb-1" htmlFor={field.label}>
                            {field.label}
                            {field.required && (
                              <Text className="text-red-500 font-semibold">
                                {" "}
                                *
                              </Text>
                            )}
                          </Label>
                        )}

                        <RenderInputField field={field} />

                        {field.error && (
                          <Text className="text-red-500 text-xs mt-1">
                            {field.error}
                          </Text>
                        )}

                        {field.description && (
                          <Text
                            className={cn(
                              "text-sm text-gray-500 font-thin mt-1",
                              field.variant === "picture"
                                ? "text-center"
                                : "text-left"
                            )}
                          >
                            {field.description}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  halfWidthField: {
    flexBasis: "48%",
    flexGrow: 1,
  },
  fullWidthField: {
    width: "100%",
  },
});
