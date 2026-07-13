import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

interface useJobCategoriesProps {
  enabled?: boolean;
}

export const useJobCategories = (
  { enabled }: useJobCategoriesProps = { enabled: true },
) => {
  const {
    data: jobCategoryRefTypeResp,
    isPending: isJobCategoriesRefTypePending,
  } = useQuery({
    queryKey: ["job-category-ref-type"],
    queryFn: async () => {
      return api.referenceTypes.refType.findById("job-category");
    },
    enabled,
  });

  const {
    isFetching: isFetchJobCategoriesPending,
    data: jobCategoriesResp,
    refetch: refetchJobCategories,
  } = useQuery({
    queryKey: ["job-categories"],
    queryFn: async () => {
      if (!jobCategoryRefTypeResp) return [];
      return api.referenceTypes.refParam.findAll({
        filter: `refTypeId||$eq||${jobCategoryRefTypeResp?.id}`,
      });
    },
    enabled: enabled && !!jobCategoryRefTypeResp,
  });

  const jobCategories = React.useMemo(() => {
    if (!jobCategoriesResp) return [];
    return jobCategoriesResp;
  }, [jobCategoriesResp]);

  return {
    jobCategories,
    isJobCategoriesPending:
      isJobCategoriesRefTypePending || isFetchJobCategoriesPending,
    refetchJobCategories,
  };
};
