import { useQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";

interface useIdentifiedUserProps {
  id: string;
  join?: string[];
}

export const useIdentifiedUser = ({
  id,
  join = [],
}: useIdentifiedUserProps) => {
  const {
    data: userResp,
    isPending: isUserPending,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", id, join],
    queryFn: () => api.client.findById(id, join),
  });

  const user = React.useMemo(() => {
    return userResp || null;
  }, [userResp]);

  return { user, refetchUser, isUserPending };
};
