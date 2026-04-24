import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

interface useEducationsProps {
  id: string;
  enabled?: boolean;
}

export const useEducations = ({ id, enabled }: useEducationsProps) => {
  const {
    data: educations,
    isPending: isEducationsPending,
    refetch: refetchEducations,
  } = useQuery({
    queryKey: ["educations", id],
    queryFn: () => api.education.findByUserId(id),
    enabled,
  });

  return { educations, isEducationsPending, refetchEducations };
};
