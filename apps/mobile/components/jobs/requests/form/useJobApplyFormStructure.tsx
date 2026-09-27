import { JobApplyStore } from "@/hooks/stores/useJobApplyStore";
import {
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  SliderFieldProps,
  TextareaFieldProps,
  CustomFieldProps,
} from "@/components/shared/form-builder/types";
import { ResponseJobDto } from "@/types";
import { SegmentedToggle } from "@/components/shared/SegmentedToggle";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface UseJobApplyFormStructureProps {
  store: JobApplyStore;
  job?: ResponseJobDto;
  priceType: "less" | "greater";
  setPriceType: (type: "less" | "greater") => void;
}

export const useJobApplyFormStructure = ({
  store,
  job,
  priceType,
  setPriceType,
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
      editable: priceType === "greater",
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

  const toggleField: Field<CustomFieldProps> = {
    id: "job-apply-price-type",
    label: "",
    variant: FieldVariant.CUSTOM,
    props: {
      render: () => (
        <SegmentedToggle
          value={priceType}
          onChange={(val) => setPriceType(val as "less" | "greater")}
          options={[
            { label: "Less Price", value: "less" },
            { label: "Greater Price", value: "greater" },
          ]}
        />
      ),
    },
  };

  const nonNegotiableField: Field<CustomFieldProps> = {
    id: "job-apply-non-negotiable",
    label: "",
    variant: FieldVariant.CUSTOM,
    props: {
      render: () => (
        <View className="bg-muted p-4 rounded-xl border border-border">
          <Text className="text-sm text-muted-foreground text-center">
            The client has indicated that the price for this job is not negotiable.
          </Text>
        </View>
      ),
    },
  };

  let pricingRows: any[] = [];

  if (job?.negotiablePrice === false) {
    pricingRows = [
      { id: 2, fields: [nonNegotiableField] },
      {
        id: 3,
        fields: [
          {
            ...proposedPriceField,
            description: "The price for this job is fixed and cannot be changed.",
            props: {
              ...proposedPriceField.props,
              value: Number(job?.price) || store.createDto.proposedPrice,
              editable: false,
            },
          },
        ],
      },
    ];
  } else {
    pricingRows = [
      { id: 2, fields: [toggleField] },
      { id: 3, fields: [proposedPriceField] },
    ];
    if (priceType === "less") {
      pricingRows.push({ id: 4, fields: [sliderField] });
    }
  }

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
        rows: pricingRows,
      },
    ],
  };

  return { structure };
};
