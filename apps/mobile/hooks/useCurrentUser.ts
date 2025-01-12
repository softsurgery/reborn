import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseFns } from "~/firebase";
import { User } from "~/types/User";

export const useCurrentUser = () => {
  const fetchCurrentUser = async () => {
    const uid = await AsyncStorage.getItem("uid");
    if (!uid) {
      throw new Error("User ID is missing.");
    }

    const response = await firebaseFns.user.fetch(uid);
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch user data.");
    }

    return response.data;
  };

  const { isFetching: isFetchingCurrentUser, data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => fetchCurrentUser(),
  });

  return { currentUser, isFetchingCurrentUser };
};
