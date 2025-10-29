import { useNavigation as useExpoNavigation } from "expo-router";
import { CommonActions } from "@react-navigation/native";
import { NavigationProps, StackParamList } from "~/types/app.routes";

interface useNavigationReturn {
  navigate: (
    route: keyof StackParamList,
    options?: { reset?: boolean; params?: any }
  ) => void;
  goBack: () => void;
  replace: () => void;
}

export const useNavigation = (): useNavigationReturn => {
  const navigation = useExpoNavigation<NavigationProps>();

  const navigate = (
    route: keyof StackParamList,
    options?: { reset?: boolean; params?: any }
  ) => {
    const { reset = false, params } = options || {};

    if (reset) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: route as string, params }],
        })
      );
    } else {
      router.push(route, params);
    }
  };

  return {
    navigate,
    goBack: navigation.goBack,
    replace: navigation.replace,
  };
};
