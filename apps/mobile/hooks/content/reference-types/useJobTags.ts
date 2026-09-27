import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

interface useJobTagsProps {
  enabled?: boolean;
}

export const useJobTags = (
  { enabled }: useJobTagsProps = { enabled: true },
) => {
  const { data: jobTagsRefTypeResp, isPending: isJobTagsRefTypePending } =
    useQuery({
      queryKey: ["job-tag-ref-type"],
      queryFn: async () => {
        return api.referenceTypes.refType.findById("job-tag");
      },
      enabled,
    });

  const {
    isFetching: isFetchJobTagsPending,
    data: jobTagsResp,
    refetch: refetchJobTags,
  } = useQuery({
    queryKey: ["job-tags"],
    queryFn: async () => {
      if (!jobTagsRefTypeResp) return [];
      return api.referenceTypes.refParam.findAll({
        filter: `refTypeId||$eq||${jobTagsRefTypeResp?.id}`,
      });
    },
    enabled: enabled && !!jobTagsRefTypeResp,
  });

  const jobTags = React.useMemo(() => {
    if (!jobTagsResp) return [];
    return jobTagsResp;
  }, [jobTagsResp]);

  return {
    jobTags,
    isJobTagsPending: isJobTagsRefTypePending || isFetchJobTagsPending,
    refetchJobTags,
  };
};
