import React from "react";
import { Text, View } from "react-native";
import { DynamicForm } from "~/types/utils/form-builder";
import { Label } from "~/components/ui/label";
import { RenderInputField } from "./RenderFields";
import { StableScrollView } from "../StableScrollView";
import { cn } from "~/lib/utils";

interface FormBuilderProps {
  className?: string;
  form: DynamicForm;
  includeHeader?: boolean;
}

export const FormBuilder = ({
  form,
  includeHeader = false,
  className,
}: FormBuilderProps) => {
  return (
    <View className={cn("flex flex-col", className)}>
        {includeHeader && (
          <View>
            <Text className="font-extrabold">{form.name}</Text>
            <Text className="font-thin mt-2">{form.description}</Text>
          </View>
        )}
        {form?.grids?.map((grid, gridIndex) => (
          <View key={gridIndex}>
            {grid?.gridItems?.map((gridItem, gridItemIndex) => (
              <View key={gridItemIndex}>
                {gridItem.fields.map((field, fieldIndex) => {
                  if (!field.hidden) {
                    return (
                      <View key={fieldIndex}>
                        {field.variant !== "checkbox" && (
                          <Label className="mb-2" htmlFor={field.label}>{field.label}</Label>
                        )}
                        <RenderInputField field={field} />
                        {field.error && (
                          <Text className="text-red-500 text-xs">
                            {field.error}
                          </Text>
                        )}
                        <Text className="text-sm text-gray-500 font-thin mb-3 mt-1">
                          {field.description}
                        </Text>
                      </View>
                    );
                  } else {
                    return null;
                  }
                })}
              </View>
            ))}
          </View>
        ))}
    </View>
  );
};
