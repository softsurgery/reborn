import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { Form } from "~/types/utils/form-builder.types";
import { getItemWidth } from "../../../lib/getItemWidth.util";
import { FieldBuilder } from "./FieldBuilder";
import { Separator } from "~/components/ui/separator";

interface FormBuilderProps {
  className?: string;
  form: Form;
}

export const FormBuilder = ({ className, form }: FormBuilderProps) => {
  return (
    <View className={cn("flex flex-col w-full", className)}>
      {form.isHeaderVisible && (
        <View className="py-5 space-y-1">
          <Text className="text-2xl font-bold">{form.title}</Text>
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
        {form?.fieldsets?.map((fieldset, fieldsetIndex) => (
          <View
            key={fieldsetIndex}
            className={cn(
              "flex w-full border-border rounded-lg bg-muted/30 ",
              form.orientation === "vertical"
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
                          form.orientation === "vertical"
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
                          <View className="flex flex-row justify-between items-center">
                            <Text
                              className={cn(
                                "text-xs text-muted-foreground",
                                field.variant === "picture" ? "text-center" : ""
                              )}
                            >
                              {field.description}
                            </Text>
                            {field?.error && (
                              <Text
                                className="text-xs font-medium"
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
