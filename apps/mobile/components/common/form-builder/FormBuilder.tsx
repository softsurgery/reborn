import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { DynamicForm } from "~/types/utils/form-builder.types";
import { getItemWidth } from "../../../lib/getItemWidth.util";
import { RenderInputField } from "./RenderFields";
import { Separator } from "~/components/ui/separator";

interface FormBuilderProps {
  className?: string;
  form: DynamicForm;
  includeHeader?: boolean;
}

export const FormBuilder = ({
  className,
  form,
  includeHeader = false,
}: FormBuilderProps) => {
  return (
    <View className={cn("flex flex-col w-full", className)}>
      {includeHeader && (
        <View className="py-5 space-y-1">
          <Text className="text-2xl font-bold">{form.name}</Text>
          <Text className="text-muted-foreground">{form.description}</Text>
          <Separator className="my-2" />
        </View>
      )}

      <View
        className={cn(
          "flex gap-4",
          form.orientation === "vertical" ? "flex-col" : "flex-col"
        )}
      >
        {form?.grids?.map((grid, index) => (
          <View
            key={index}
            className={cn(
              "flex w-full border border-border rounded-lg bg-muted/30 p-4",
              form.orientation === "vertical"
                ? "flex-col gap-10"
                : "flex-col gap-12"
            )}
          >
            {grid.includeHeader && (
              <View className="flex flex-col gap-2 mb-2">
                <Text className="text-xl font-semibold">{grid.name}</Text>
                <Separator className="my-1" />
              </View>
            )}

            {grid?.gridItems?.map((gridItem) => {
              const fieldCount = gridItem.fields.length;
              return (
                <View
                  key={gridItem.id}
                  className="flex flex-row flex-wrap gap-4 w-full"
                >
                  {gridItem.fields.map((field, idx) => {
                    if (field.hidden) return null;

                    return (
                      <View
                        key={`${idx}-${field.error}`}
                        className={cn(
                          "flex flex-col gap-2",
                          form.orientation === "vertical"
                            ? "w-full"
                            : getItemWidth(fieldCount),
                          field.containerClassName
                        )}
                      >
                        <View className="flex flex-row justify-between items-center">
                          {field.variant !== "check" && (
                            <Text className="text-md font-semibold">
                              {field.label}
                              {field.required && (
                                <Text className="text-red-500 dark:text-red-500 ">
                                  *
                                </Text>
                              )}
                            </Text>
                          )}
                          {!!field?.error && (
                            <Text className="text-xs text-red-500 dark:text-red-500 font-medium">
                              {field?.error}
                            </Text>
                          )}
                        </View>

                        <RenderInputField field={field} />

                        {!!field.description && (
                          <Text className={cn("text-xs text-muted-foreground",field.variant === "picture" ? "text-center" : "")}>
                            {field.description}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};
