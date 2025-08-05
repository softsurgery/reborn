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
    error: store.signUpRequestErrors?.email?.[0],
    props: {
      value: store.signUpRequest.email,
      onChangeText: (value: string) => {
        store.setNested("signUpRequest.email", value);
        store.setNested("signUpRequestErrors.email", []);
      },
      editable: !isPending,
    },
  };

  //firstname
  const firstnameField: Field<TextFieldProps> = {
    id: "firstname",
    label: "First Name",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter your first name",
    disabled: false,
    description: "Your first name (e.g., John).",
    error: store.signUpRequestErrors?.firstName?.[0],
    props: {
      value: store.signUpRequest.firstName,
      onChangeText: (value: string) => {
        store.setNested("signUpRequest.firstName", value);
        store.setNested("signUpRequestErrors.firstName", []);
      },
      editable: !isPending,
    },
  };

  //lastname
  const lastnameField: Field<TextFieldProps> = {
    id: "surname",
    label: "Surname",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter your surname",
    disabled: false,
    description: "Your last name (e.g., Doe).",
    error: store.signUpRequestErrors?.lastName?.[0],
    props: {
      value: store.signUpRequest.lastName,
      onChangeText: (value: string) => {
        store.setNested("signUpRequest.lastName", value);
        store.setNested("signUpRequestErrors.lastName", []);
      },
      editable: !isPending,
    },
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
    error: store.signUpRequestErrors?.email?.[0],
    props: {
      value: store.signUpRequest.email,
      onChangeText: (value: string) => {
        store.setNested("signUpRequest.email", value);
        store.setNested("signUpRequestErrors.email", []);
      },
      editable: !isPending,
    },
  };

  const usernameField: Field<TextFieldProps> = {
    id: "username",
    label: "Username",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter your username",
    disabled: false,
    description: "Your username (e.g., johndoe)",
    error: store.signUpRequestErrors?.username?.[0],
    props: {
      value: store.signUpRequest.username,
      onChangeText: (value: string) => {
        store.setNested("signUpRequest.username", value);
        store.setNested("signUpRequestErrors.username", []);
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
    error: store.signUpRequestErrors?.password?.[0],
    props: {
      value: store.signUpRequest.password,
      onChangeText: (value: string) => {
        store.setNested("signUpRequest.password", value);
        store.setNested("signUpRequestErrors.password", []);
      },
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
    error: store.signUpRequestErrors?.confirmPassword?.[0],
    props: {
      value: store.utilities.confirmPassword,
      onChangeText: (text: string) => {
        store.setNested("utilities.confirmPassword", text);
        store.setNested("signUpRequestErrors.confirmPassword", []);
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
            fields: [firstnameField, lastnameField],
          },
          {
            id: 2,
            fields: [emailField],
          },
          {
            id: 3,
            fields: [usernameField],
          },
          {
            id: 4,
            fields: [passwordField, confirmPasswordField],
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
