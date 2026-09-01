import { JobApplyStore } from "@/hooks/stores/useJobApplyStore";
import {
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  SliderFieldProps,
  TextareaFieldProps,
} from "@/components/shared/form-builder/types";
import { ResponseJobDto } from "@/types";

interface UseJobApplyFormStructureProps {
  store: JobApplyStore;
  job?: ResponseJobDto;
}

export const useJobApplyFormStructure = ({
  store,
  job,
}: UseJobApplyFormStructureProps) => {
  const messageField: Field<TextareaFieldProps> = {
    id: "job-apply-message",
    label: "Cover Letter / Message",
    description:
      "Explain why you are the best fit for this job. Include your relevant experience and how you plan to complete the work.",
    variant: FieldVariant.TEXTAREA,
    required: true,
    placeholder: "Hi, I'm interested in this job because...",
    error: store.errors.message?.[0],
    props: {
      value: store.createDto.message,
      onChangeText: (value) => {
        store.setNested("createDto.message", value);
        store.setNested("errors.message", []);
      },
    },
  };

  const unit =
    job?.currency?.extras?.symbol ||
    job?.currency?.extras?.code ||
    job?.currency?.label ||
    "";

  const proposedPriceField: Field<NumberFieldProps> = {
    id: "job-apply-proposed-price",
    label: "Your Proposed Rate",
    description:
      "What is your estimated cost to complete this job? Leave blank if you agree with the client's posted price.",
    variant: FieldVariant.NUMBER,
    required: false,
    placeholder: "e.g. 150",
    error: store.errors.proposedPrice?.[0],
    props: {
      value: store.createDto.proposedPrice,
      onChangeText: (value: number) => {
        store.setNested("createDto.proposedPrice", value);
        store.setNested("errors.proposedPrice", []);
      },
    },
  };

  const sliderField: Field<SliderFieldProps> = {
    id: "job-apply-proposed-price-slider",
    label: "",
    variant: FieldVariant.SLIDER,
    required: false,
    props: {
      initialValue: store.createDto.proposedPrice || Number(job?.price) || 0,
      rangeMinValue: 0,
      rangeMaxValue: (Number(job?.price) || 500) * 2,
      step: 10,
      label: "Adjust Rate",
      unit: unit,
      onValueChange: (val: number) => {
        store.setNested("createDto.proposedPrice", val);
        store.setNested("errors.proposedPrice", []);
      },
    },
  };

  const structure: FormStructure = {
    title: "",
    isHeaderVisible: false,
    fieldsets: [
      {
        title: "Application Details",
        description: "Submit your proposal to the client.",
        rows: [{ id: 1, fields: [messageField] }],
      },
      {
        title: "Pricing",
        description: "Set your terms for this job.",
        rows: [
          { id: 2, fields: [proposedPriceField] },
          { id: 3, fields: [sliderField] },
        ],
      },
    ],
  };

  return { structure };
};
