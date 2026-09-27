import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

interface useRegionsProps {
  enabled?: boolean;
}

export const useRegions = (
  { enabled }: useRegionsProps = { enabled: true },
) => {
  const {
    data: regionsResp,
    isFetching: isRegionsPending,
    refetch: refetchRegions,
  } = useQuery({
    queryKey: ["regions"],
    queryFn: () =>
      api.referenceTypes.refParam.findAll({
        filter: `refTypeId||$eq||region`,
      }),
    enabled,
  });

  const regions = React.useMemo(() => {
    if (!regionsResp) return [];
    return regionsResp;
  }, [regionsResp]);

  return {
    regions,
    isRegionsPending,
    refetchRegions,
  };
};
