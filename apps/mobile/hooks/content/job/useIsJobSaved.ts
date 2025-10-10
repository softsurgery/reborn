import { useQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";

export const useIsJobSaved = (id: string) => {
  const {
    data: isJobSavedResp,
    isPending: isSavedPending,
    refetch: refetchIsJobSaved,
  } = useQuery({
    queryKey: ["is-job-saved", id],
    queryFn: () => api.jobSave.findSaved(id as string),
    enabled: !!id,
  });

  const isJobSaved = React.useMemo(() => !!isJobSavedResp, [isJobSavedResp]);

  return {
    isJobSaved,
    isSavedPending,
    refetchIsJobSaved,
  };
};
