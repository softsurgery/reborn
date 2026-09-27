import React from "react";
import { api } from "~/api";
import { useQuery } from "@tanstack/react-query";

export const useIsJobViewed = (id: string) => {
  const {
    data: isJobViewedResp,
    isPending: isViewedPending,
    refetch: refetchIsJobViewed,
  } = useQuery({
    queryKey: ["is-job-viewed", id],
    queryFn: async () => {
      const isViewed = await api.jobView.findViewed(id as string);
      return !!isViewed;
    },
  });

  const isJobViewed = React.useMemo(() => isJobViewedResp, [isJobViewedResp]);

  return {
    isJobViewed,
    isViewedPending,
    refetchIsJobViewed,
  };
};
