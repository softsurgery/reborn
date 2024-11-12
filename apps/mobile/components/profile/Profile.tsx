import { useAuthFunctions } from "~/hooks/useAuthFunctions";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { LogOut } from "lucide-react-native";

export const Profile = () => {
  const { handleSignOut } = useAuthFunctions();

  return (
    <>
      <Text className="p-10">Profile</Text>

      <Button
        variant="outline"
        onPress={handleSignOut}
        className="flex flex-row gap-2 mx-10"
      >
        <IconWithTheme icon={LogOut} size={20} />
        <Text>Disconnect</Text>
      </Button>
    </>
  );
};
