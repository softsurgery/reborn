import {
  EmailFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  PasswordFieldProps,
  TextFieldProps,
} from "~/components/shared/form-builder/types";
import { AuthStore } from "~/hooks/stores/useAuthStore";

interface useSignUpFormStructureProps {
  store: AuthStore;
  isPending?: boolean;
}

export const useSignUpFormStructure = ({
  store,
  isPending,
}: useSignUpFormStructureProps) => {
  //pre-email
  const preEmailField: Field<EmailFieldProps> = {
    id: "email",
    label: "E-mail",
    placeholder: "john@doe.com",
    variant: FieldVariant.EMAIL,
    required: false,
    className: "w-full",
    error: store.signUpRequestErrors.email?.[0],
    props: {
      value: store.signUpRequest.email,
      onChangeText: (value: string) => {
        store.setNested("signUpRequest.email", value);
        store.setNested("signUpRequestErrors.email", []);
      },
      editable: !isPending,
    },
  };

  //name
  const nameField: Field<TextFieldProps> = {
    id: "name",
    label: "Name",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter your name",
    disabled: false,
    description: "Your first name (e.g., John).",
    props: {},
  };

  //surname
  const surnameField: Field<TextFieldProps> = {
    id: "surname",
    label: "Surname",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter your surname",
    disabled: false,
    description: "Your last name (e.g., Doe).",
    props: {},
  };

  //pre-email
  const emailField: Field<EmailFieldProps> = {
    id: "email",
    label: "E-mail",
    placeholder: "john@doe.com",
    description: "Please verify your e-mail",
    variant: FieldVariant.EMAIL,
    required: true,
    className: "w-full",
    error: store.signUpRequestErrors.email?.[0],
    props: {
      value: store.signUpRequest.email,
      onChangeText: (value: string) => {
        store.setNested("signUpRequest.email", value);
        store.setNested("signUpRequestErrors.email", []);
      },
      editable: !isPending,
    },
  };

  //password
  const passwordField: Field<PasswordFieldProps> = {
    id: "password",
    label: "Password",
    description: "Please enter your password",
    variant: FieldVariant.PASSWORD,
    required: true,
    placeholder: "••••••••",
    error: store.signUpRequestErrors.password?.[0],
    props: {
      value: store.signUpRequest.password,
      onChangeText: (value: string) => {},
      editable: !isPending,
    },
  };

  const confirmPasswordField: Field<PasswordFieldProps> = {
    id: "confirm-password",
    label: "Confirm Password",
    description: "Please enter your password again",
    variant: FieldVariant.PASSWORD,
    required: true,
    placeholder: "••••••••",
    props: {
      value: store.utilities.confirmPassword,
      onChangeText: (text: string) => {
        store.setNested("utilities.confirmPassword", text);
      },
      editable: !isPending,
    },
  };

  const signUpFormStructure: FormStructure = {
    title: "",
    description: "",
    orientation: "horizontal",
    fieldsets: [
      {
        title: "",
        rows: [
          {
            id: 2,
            fields: [preEmailField],
          },
        ],
      },
    ],
  };

  const signUpCarryOnFormStructure: FormStructure = {
    title: "",
    description: "",
    orientation: "horizontal",
    fieldsets: [
      {
        title: "",
        rows: [
          {
            id: 1,
            fields: [nameField, surnameField],
          },
          {
            id: 2,
            fields: [emailField, passwordField, confirmPasswordField],
          },
        ],
      },
    ],
  };

  return {
    signUpFormStructure,
    signUpCarryOnFormStructure,
  };
};
