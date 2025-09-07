import React from "react";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { useCreateJobFormStructure } from "./forms/useCreatJobFormStructure";
import { useJobStore } from "~/hooks/stores/useJobStore";
import { useCurrencies } from "~/hooks/content/useCurrencies";
import { mapToSelectOptions } from "~/components/shared/form-builder/utils/mapToSelectOptions";
import { useJobTags } from "~/hooks/content/job/useJobTags";
import { useJobCategories } from "~/hooks/content/job/useJobCategories";
import { StableScrollView } from "~/components/shared/StableScrollView";

interface JobCreateFormProps {
  className?: string;
}

export const JobCreateForm = ({ className }: JobCreateFormProps) => {
  const jobStore = useJobStore();
  const { currencies } = useCurrencies();
  const { isFetchJobTagsPending, jobTags } = useJobTags();
  const { jobCategories, isFetchJobCategoriesPending } = useJobCategories();

  const { jobCreateFormStructure } = useCreateJobFormStructure({
    jobStore,
    currencies,
    jobTags: mapToSelectOptions({
      data: isFetchJobTagsPending ? [] : jobTags,
      labelKey: "label",
      valueKey: "id",
    }),
    jobCategories: mapToSelectOptions({
      data: isFetchJobCategoriesPending ? [] : jobCategories,
      labelKey: "label",
      valueKey: "id",
    }),
  });
  return (
    <StableScrollView>
      <FormBuilder structure={jobCreateFormStructure} className={className} />
    </StableScrollView>
  );
};
