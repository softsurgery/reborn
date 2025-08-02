// import { CheckedState } from "@radix-ui/react-checkbox";
import { TextInputProps } from "react-native";

export interface FormStructure {
  title: string;
  description?: string;
  orientation?: "vertical" | "horizontal";
  isHeaderVisible?: boolean;
  fieldsets: Fieldset[];
}

export interface Fieldset {
  title?: string;
  description?: string;
  isHeaderVisible?: boolean;
  rows: FieldsetRow[];
}

export interface FieldsetRow {
  id: number;
  fields: Field[];
}

export interface Field<T = any> {
  id: string;
  label: string;
  className?: string;
  containerClassName?: string;
  variant: FieldVariant;
  required?: boolean;
  description?: string;
  placeholder?: string;
  hidden?: boolean;
  error?: string;
  disabled?: boolean;
  props?: T;
}

export enum FieldVariant {
  TEXT = "text",
  EMAIL = "email",
  TEL = "tel",
  NUMBER = "number",
  PASSWORD = "password",
  DATE = "date",
  SELECT = "select",
  CHECKBOX = "checkbox",
  CHECK = "check",
  RADIO = "radio",
  TEXTAREA = "textarea",
  SWITCH = "switch",
  RATING = "rating",
  PICTURE = "picture",
  DOUBLE_CHOICE = "double-choice",
  CUSTOM = "custom",
}

export interface TextFieldProps {
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
}

export interface TextareaFieldProps {
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  cols?: number;
  rows?: number;
}

export interface EmailFieldProps {
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
}

export interface TelFieldProps {
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
}

export interface NumberFieldProps {
  value?: number;
  onChangeText?: (text: number) => void;
  editable?: boolean;
}

export interface PasswordFieldProps {
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
}

export interface DateFieldProps {
  value?: Date;
  onChangeText?: (text: Date) => void;
  editable?: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps {
  value?: string;
  onSelect?: (value: string) => void;
  options?: SelectOption[];
  editable?: boolean;
}

export interface RatingFieldProps {
  value: number;
  onValueChange?: (value: number) => void;
  editable?: boolean;
  color?: string;
}
