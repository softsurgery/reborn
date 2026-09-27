import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface useSkillsProps {
  enabled?: boolean;
}

export const useSkills = (
  { enabled }: useSkillsProps = { enabled: true },
) => {
  const {
    data: skillsResp,
    isPending: isSkillsPending,
    refetch: refetchSkills,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: async () =>
      api.referenceTypes.refParam.findAll({
        filter: "refTypeId||$eq||skill",
      }),
    enabled,
  });

  const skills = React.useMemo(() => {
    if (!skillsResp) return [];
    return skillsResp;
  }, [skillsResp]);

  return {
    skills,
    isSkillsPending,
    refetchSkills,
  };
};
