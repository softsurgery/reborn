import { AuthManager } from "~/hooks/stores/use-auth-form";
import { Field, FieldVariant, Form } from "~/types/utils/form-builder.types";

interface SigninFormObjectProps {
  store: AuthManager;
  isPending?: boolean;
}

export const getSigninFormObject = ({
  store,
  isPending,
}: SigninFormObjectProps): Form => {
  const emailField: Field = {
    label: "E-mail",
    description: "Please enter your e-mail",
    variant: FieldVariant.EMAIL,
    required: true,
    className: "w-full",
    error: store.emailError,
    props: {
      value: store.email,
      onChangeText: (text: string) => {
        store.set("email", text);
        store.set("emailError", "");
      },
      editable: !isPending,
    },
  };
  const passwordField: Field = {
    label: "Password",
    description: "Please enter your password",
    variant: FieldVariant.PASSWORD,
    required: true,
    className: "w-full",
    error: store.passwordError,
    props: {
      value: store.password,
      onChangeText: (text: string) => {
        store.set("password", text);
        store.set("passwordError", "");
      },
      editable: !isPending,
    },
  };
  return {
    title: "Sign In",
    description: "Sign in to your account",
    orientation: "vertical",
    isHeaderVisible: false,
    fieldsets: [
      {
        title: "default",
        rows: [
          {
            id: 1,
            fields: [emailField, passwordField],
          },
        ],
      },
    ],
  };
};
