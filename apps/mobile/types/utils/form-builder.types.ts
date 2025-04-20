// import { CheckedState } from "@radix-ui/react-checkbox";
import { TextInputProps } from "react-native";

export interface DynamicForm {
  name: string;
  description?: string;
  orientation?: "vertical" | "horizontal";  
  grids: DynamicFormGrid[];
}

export interface DynamicFormGrid {
  name?: string;
  includeHeader?: boolean;
  gridItems: DynamicFormGridItems[];
}

export interface DynamicFormGridItems {
  id: number;
  fields: Field[];
}

export interface Field {
  label: string;
  className?: string;
  containerClassName?: string;
  variant:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "password"
    | "date"
    | "select"
    | "checkbox"
    | "radio"
    | "textarea"
    | "switch"
    | "rating"
    | "picture"
    | "double-choice"
    | "custom";
  required?: boolean;
  description?: string;
  placeholder?: string;
  hidden?: boolean;
  error?: string;
  disabled?: boolean;
  props?: {
    // Common value handling for different inputs
    value?: string | number | Date | boolean;
    onChangeText?: (text: string) => void; // For text-based inputs
    onValueChange?: (value: string | number | boolean) => void; // For select, radio, switch, checkbox
    onDateChange?: (date: Date | null) => void; // For date pickers
    selectOptions?: { label: string; value: string }[]; // For select & radio
    other?: any; // Custom properties for special inputs
    inputProps?: TextInputProps; // Additional props for TextInput
    rating? : number; // For rating
    positiveChoice?: boolean; // For double-choice
    negativeChoice?: boolean; 
    pChoice?: string;
    nChoice?: string;
  };
}
