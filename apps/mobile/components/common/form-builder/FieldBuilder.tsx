import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Field, FieldVariant } from "~/types/utils/form-builder.types";
import Select from "../Select";
import { Checkbox } from "~/components/ui/checkbox";
import { DatePicker } from "~/components/ui/date-picker";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import StarRating from "react-native-star-rating-widget";
import { PictureUploader } from "../PictureUploader";
import { DoubleChoice } from "../DoubleChoice";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface FieldBuilderProps {
  field?: Field<any>;
}

export const FieldBuilder = ({ field }: FieldBuilderProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  //   const [date, setDate] = useState(
  //     field?.props?.value ? new Date(field?.props?.value) : new Date()
  //   );
  //   const onChangeDate = (event: any, selectedDate?: Date | undefined) => {
  //     const currentDate = selectedDate || date;
  //     setShowDatePicker(Platform.OS === "ios" ? true : false);
  //     setDate(currentDate);
  //     if (field?.props?.onDateChange) {
  //       field?.props?.onDateChange(currentDate);
  //     }
  //   };

  switch (field?.variant) {
    case "text":
    case "tel":
    case "number":
      return (
        <View className="flex flex-col w-full">
          <Input
            editable={field?.props?.editable}
            id={field.label}
            keyboardType={
              field.variant === FieldVariant.NUMBER ? "numeric" : undefined
            }
            placeholder={field.placeholder}
            value={field?.props?.value?.toString() || ""}
            onChangeText={(text) => field?.props?.onChangeText?.(text)}
            {...field.props?.other}
            className={cn("p-3 rounded-md")}
          />
        </View>
      );
    case "email":
      return (
        <Input
          editable={field?.props?.editable}
          keyboardType="email-address"
          placeholder={field.placeholder}
          value={field?.props?.value?.toString() || ""}
          onChangeText={(text) => field?.props?.onChangeText?.(text)}
          className={cn("p-3 rounded-md")}
          style={field?.error ? { borderColor: "red" } : {}}
          {...field.props?.other}
        />
      );
    case "select":
      return (
        <Select
          title={field.label}
          value={field?.props?.value?.toString()}
          onSelect={(value) => field?.props?.onValueChange?.(value)}
          options={field?.props?.selectOptions}
          description={field.description}
          disabled={field?.props?.other}
        />
      );
    case "date":
      return (
        <View className="flex flex-col gap-2 w-full">
          <DatePicker
            date={
              field?.props?.value instanceof Date
                ? field.props.value
                : new Date(
                    typeof field?.props?.value === "string" ||
                    typeof field?.props?.value === "number"
                      ? field.props.value
                      : Date.now()
                  )
            }
            onChange={(onDateChange) =>
              field?.props?.onDateChange?.(onDateChange)
            }
          />
        </View>
      );
    case "checkbox":
      return (
        <View className="flex-row items-center gap-2">
          <Checkbox
            checked={!!field?.props?.value}
            onCheckedChange={(checked) =>
              field?.props?.onValueChange?.(checked)
            }
          />
          <Text>{field.label}</Text>
        </View>
      );
    case "password":
      return (
        <View className="w-full" style={{ position: "relative" }}>
          <Input
            style={{
              flex: 1,
              padding: 10,
              paddingRight: 40,
            }}
            secureTextEntry={!showPassword}
            value={field?.props?.value?.toString() || ""}
            onChangeText={(text) => field?.props?.onChangeText?.(text)}
            editable={field?.props?.editable}
            autoComplete="off"
            autoCorrect={false}
            spellCheck={false}
            textContentType="none"
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 10,
              top: 7,
              padding: 4,
            }}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      );
    case "textarea":
      return (
        <View className="flex flex-col gap-2 w-full">
          <Textarea
            className="h-52"
            editable={field?.props?.other}
            placeholder={field.placeholder}
            value={field?.props?.value?.toString() || ""}
            onChangeText={field?.props?.onChangeText}
            {...field.props?.other}
          />
        </View>
      );
    case "rating":
      return (
        <View className="flex flex-col w-full">
          <View className="mx-auto">
            <StarRating
              rating={field?.props?.rating || 0}
              onChange={(rating) => field.props?.onValueChange?.(rating)}
              maxStars={5}
              color="gray"
            />
          </View>
        </View>
      );
    case "picture":
      return (
        <PictureUploader
          image={field?.props?.value}
          onChange={field?.props?.onValueChange}
        />
      );
    case "double-choice":
      return (
        <DoubleChoice
          disabled={field?.props?.other}
          positiveChoice={{
            label: field?.props?.pChoice as string,
            value: field?.props?.positiveChoice,
          }}
          negativeChoice={{
            label: field?.props?.nChoice as string,
            value: field?.props?.negativeChoice,
          }}
          value={field?.props?.value}
          onChange={field?.props?.onValueChange as any as (value: any) => void}
        />
      );
    default:
      return (
        <Text style={{ color: "red", fontSize: 12 }}>
          Cannot Render Element
        </Text>
      );
  }
};
