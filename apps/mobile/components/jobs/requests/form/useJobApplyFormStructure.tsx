import { JobApplyStore } from "@/hooks/stores/useJobApplyStore";
import {
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  TextareaFieldProps,
} from "@/components/shared/form-builder/types";

interface UseJobApplyFormStructureProps {
  store: JobApplyStore;
}

export const useJobApplyFormStructure = ({
  store,
}: UseJobApplyFormStructureProps) => {
  const messageField: Field<TextareaFieldProps> = {
    id: "job-apply-message",
    label: "Message",
    variant: FieldVariant.TEXTAREA,
    required: false,
    placeholder: "Introduce yourself and explain why you're a good fit...",
    error: store.errors.message?.[0],
    props: {
      value: store.createDto.message,
      onChangeText: (value) => {
        store.setNested("createDto.message", value);
        store.setNested("errors.message", []);
      },
    },
  };

  const proposedPriceField: Field<NumberFieldProps> = {
    id: "job-apply-proposed-price",
    label: "Proposed Price",
    description: "Leave blank to accept the current price.",
    variant: FieldVariant.NUMBER,
    required: false,
    error: store.errors.proposedPrice?.[0],
    props: {
      value: store.createDto.proposedPrice,
      onChangeText: (value: number) => {
        store.setNested("createDto.proposedPrice", value);
        store.setNested("errors.proposedPrice", []);
      },
    },
  };

  const structure: FormStructure = {
    title: "",
    isHeaderVisible: false,
    fieldsets: [
      {
        rows: [
          { id: 1, fields: [messageField] },
          { id: 2, fields: [proposedPriceField] },
        ],
      },
    ],
  };

  return { structure };
};
