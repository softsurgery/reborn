import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

export const useRegions = (enabled?: boolean) => {
  const {
    isFetching: isFetchRegionsPending,
    data: regionsResp,
    refetch: refetchRegions,
  } = useQuery({
    queryKey: ["regions"],
    queryFn: () => api._public.region.findAll(),
    enabled,
  });

  const regions = React.useMemo(() => {
    if (!regionsResp) return [];
    return regionsResp;
  }, [regionsResp]);

  return {
    regions,
    isFetchRegionsPending,
    refetchRegions,
  };
};
