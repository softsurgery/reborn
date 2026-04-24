import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

interface useRegionsProps {
  enabled?: boolean;
}

export const useRegions = (
  { enabled }: useRegionsProps = { enabled: true },
) => {
  const { data: regionRefTypeResp, isPending: isRegionRefTypePending } =
    useQuery({
      queryKey: ["region-ref-type"],
      queryFn: () => api.referenceTypes.refType.findById("region"),
      enabled,
    });

  const {
    isFetching: isFetchRegionsPending,
    data: regionsResp,
    refetch: refetchRegions,
  } = useQuery({
    queryKey: ["regions"],
    queryFn: () =>
      api.referenceTypes.refParam.findAll({
        filter: `refTypeId||$eq||${regionRefTypeResp?.id}`,
      }),
    enabled: enabled && !!regionRefTypeResp,
  });

  const regions = React.useMemo(() => {
    if (!regionsResp) return [];
    return regionsResp;
  }, [regionsResp]);

  return {
    regions,
    isRegionsPending: isRegionRefTypePending || isFetchRegionsPending,
    refetchRegions,
  };
};
