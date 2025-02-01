import { useQuery } from "@tanstack/react-query";
import { firebaseFns } from "~/firebase";

export const useCurrentUser = () => {
  const fetchCurrentUser = async () => {
    const response = await firebaseFns.user.fetchCurrent();
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch user data.");
    }

    return response.data;
  };

  const {
    isFetching: isFetchingCurrentUser,
    refetch: refetchCurrentUser,
    data: currentUser,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => fetchCurrentUser(),
  });

  return { currentUser, refetchCurrentUser, isFetchingCurrentUser };
};
