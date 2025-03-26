import React from "react";
import { useQuery } from "@tanstack/react-query";
import { firebaseFns } from "~/firebase";

export const useContextUsers = (context: string) => {
  const {
    isFetching: isFetchingUsers,
    refetch: refetchUsers,
    data: usersResponse,
  } = useQuery({
    queryKey: [`users-${context}`],
    queryFn: () => firebaseFns.user.fetchAll(),
  });

  const users = React.useMemo(() => {
    return usersResponse?.data || [];
  }, [usersResponse]);

  return { users, refetchUsers, isFetchingUsers };
};
