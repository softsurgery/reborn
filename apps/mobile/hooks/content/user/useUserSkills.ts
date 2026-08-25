import { useQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";

interface UseUserSkillsProps {
  userId?: string;
  enabled?: boolean;
}

export const useUserSkills = ({
  userId,
  enabled = true,
}: UseUserSkillsProps) => {
  const {
    data: userSkillsResp,
    isPending: isUserSkillsPending,
    refetch: refetchUserSkills,
  } = useQuery({
    queryKey: ["user-skills", userId],
    queryFn: () => api.client.getSkills(userId!),
    enabled,
  });

  const userSkills = React.useMemo(() => {
    if (!userSkillsResp) return [];
    return userSkillsResp;
  }, [userSkillsResp]);

  return {
    userSkills,
    isUserSkillsPending,
    refetchUserSkills,
  };
};
