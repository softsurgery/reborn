import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface useSkillsProps {
  enabled?: boolean;
}

export const useSkills = ({ enabled = true }: useSkillsProps = {}) => {
  const {
    isFetching: isFetchSkillsPending,
    data: skillsResp,
    refetch: refetchSkills,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: () =>
      api.referenceTypes.refParam.findAll({
        filter: `refType.label||$eq||Skill`,
      }),
    enabled,
  });

  const skills = React.useMemo(() => {
    if (!skillsResp) return [];
    return skillsResp;
  }, [skillsResp]);

  return {
    skills,
    isFetchSkillsPending,
    refetchSkills,
  };
};
