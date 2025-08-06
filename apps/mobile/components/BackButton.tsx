import { ArrowLeft } from "lucide-react-native";
import { Pressable } from "react-native";
import { useNavigation } from "~/hooks/useNavigation";
import Icon from "~/lib/Icon";
import { cn } from "~/lib/utils";
import { StackParamList } from "~/types/app.routes";

interface BackButtonProps {
  className?: string;
  route: keyof StackParamList;
}

export const BackButton = ({ className, route }: BackButtonProps) => {
  const navigation = useNavigation();
  if (!navigation) {
    return null;
  }
  return (
    <Pressable
      className={cn("flex flex-row items-center gap-2", className)}
      onPress={() => navigation.navigate(route, { reset: true })}
    >
      <Icon name={ArrowLeft} size={24} />
    </Pressable>
  );
};
