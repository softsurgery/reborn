import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { FormStructure } from "~/components/shared/form-builder/types";
import { getItemWidth } from "./item-width";
import { FieldBuilder } from "./FieldBuilder";
import { Separator } from "~/components/ui/separator";

interface FormBuilderProps {
  className?: string;
  structure: FormStructure;
}

export const FormBuilder = ({ className, structure }: FormBuilderProps) => {
  return (
    <View className={cn("flex flex-col w-full", className)}>
      {structure.isHeaderVisible && (
        <View className="py-5 space-y-1">
          <Text className="text-2xl font-bold">{structure.title}</Text>
          <Text className="text-muted-foreground">{structure.description}</Text>
          <Separator className="my-2" />
        </View>
      )}

      <View
        className={cn(
          "flex gap-4",
          structure.orientation === "vertical" ? "flex-col" : "flex-col"
        )}
      >
        {structure?.fieldsets?.map((fieldset, fieldsetIndex) => (
          <View
            key={fieldsetIndex}
            className={cn(
              "flex w-full border-border rounded-lg",
              structure.orientation === "vertical"
                ? "flex-col gap-10"
                : "flex-col gap-12"
            )}
          >
            {fieldset.isHeaderVisible && (
              <View className="flex flex-col gap-2 mb-2">
                <Text className="text-xl font-semibold">{fieldset.title}</Text>
                <Separator className="my-1" />
              </View>
            )}

            {fieldset?.rows?.map((row) => {
              const fieldCount = row.fields.length;
              return (
                <View
                  key={row.id}
                  className="flex flex-row flex-wrap gap-4 w-full"
                >
                  {row.fields.map((field, fieldIndex) => {
                    if (field.hidden) return null;

                    return (
                      <View
                        key={fieldIndex}
                        className={cn(
                          "flex flex-col gap-2",
                          structure.orientation === "vertical"
                            ? "w-full"
                            : getItemWidth(fieldCount),
                          field.containerClassName
                        )}
                      >
                        <View className="flex flex-row justify-between items-center">
                          {field.variant !== "check" && (
                            <Text className="text-md font-semibold">
                              {field.label}{" "}
                              {field.required && (
                                <Text className="text-red-500 dark:text-red-500">
                                  *
                                </Text>
                              )}
                            </Text>
                          )}
                        </View>

                        <FieldBuilder field={field} />

                        {field.description && (
                          <View className="flex flex-col justify-between">
                            {!field?.error && (
                              <Text
                                className={cn(
                                  "text-md text-gray-500 dark:text-gray-400",
                                  field.variant === "picture"
                                    ? "text-center"
                                    : ""
                                )}
                              >
                                {field.description}
                              </Text>
                            )}
                            {field?.error && (
                              <Text
                                className="text-md font-medium"
                                style={{ color: "red" }}
                              >
                                {field?.error}
                              </Text>
                            )}
                          </View>
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
