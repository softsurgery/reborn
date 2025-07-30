import { View } from "react-native";
import { FormBuilder } from "../shared/form-builder/FormBuilder";
import { getSigninFormObject } from "./getSigninFormObject";
import { useAuthManager } from "~/hooks/stores/use-auth-form";

interface SignInFormProps {
  isPending?: boolean;
}

export const SignInForm = ({ isPending }: SignInFormProps) => {
  const authManager = useAuthManager();
  return (
    <View>
      <FormBuilder
        structure={getSigninFormObject({ store: authManager, isPending })}
      />
    </View>
  );
};
