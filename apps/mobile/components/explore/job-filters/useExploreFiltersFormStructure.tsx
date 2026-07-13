import {
  DateFieldProps,
  Field,
  FieldVariant,
  MultiSelectFieldProps,
  SelectOption,
} from "@/components/shared/form-builder/types";
import { ExploreFilterStore } from "@/hooks/stores/userExploreFilterStore";

interface UseExploreFilterFormStructureProps {
  store: ExploreFilterStore;
  categories?: SelectOption[];
  tags?: SelectOption[];
  skills?: SelectOption[];
  isPending?: boolean;
}

export const useExploreFilterFormStructure = ({
  store,
  categories,
  tags,
  skills,
  isPending,
}: UseExploreFilterFormStructureProps) => {
  const startDataField: Field<DateFieldProps> = {
    id: "startDate",
    label: "Start Date",
    variant: FieldVariant.DATE,
    required: false,
    placeholder: "Select start date",
    description: "Filter jobs starting from this date.",
    disabled: isPending,
    props: {
      value: store.dto?.startDate,
      onDateChange: (value) => store.setNested("dto.startDate", value),
    },
  };

  const endDateField: Field<DateFieldProps> = {
    id: "endDate",
    label: "End Date",
    variant: FieldVariant.DATE,
    required: false,
    placeholder: "Select end date",
    description: "Filter jobs ending by this date.",
    disabled: isPending,
    props: {
      value: store.dto?.endDate,
      onDateChange: (value) => store.setNested("dto.endDate", value),
    },
  };

  const categoriesField: Field<MultiSelectFieldProps> = {
    id: "categories",
    label: "Categories",
    variant: FieldVariant.MULTISELECT,
    required: false,
    placeholder: "Select categories",
    description: "Select the categories you're interested in.",
    disabled: isPending,
    props: {
      value: store.dto.categories.map(String),
      onSelect: (value) => store.setNested("dto.categories", value.map(Number)),
      options: categories,
    },
  };

  const tagsField: Field<MultiSelectFieldProps> = {
    id: "tags",
    label: "Tags",
    variant: FieldVariant.MULTISELECT,
    required: false,
    placeholder: "Select tags",
    description: "Select relevant tags for the jobs you're interested in.",
    disabled: isPending,
    props: {
      value: store.dto.tags.map(String),
      onSelect: (value) => store.setNested("dto.tags", value.map(Number)),
      options: tags,
    },
  };

  const skillsField: Field<MultiSelectFieldProps> = {
    id: "skills",
    label: "Skills",
    variant: FieldVariant.MULTISELECT,
    required: false,
    placeholder: "Select skills",
    description: "Select relevant skills for the jobs you're interested in.",
    disabled: isPending,
    props: {
      value: store.dto.skills.map(String),
      onSelect: (value) => store.setNested("dto.skills", value.map(Number)),
      options: skills,
    },
  };

  return {
    title: "Explore Filters",
    fieldsets: [
      {
        rows: [
          {
            id: 1,
            fields: [
              startDataField,
              endDateField,
              categoriesField,
              tagsField,
              skillsField,
            ],
          },
        ],
      },
    ],
  };
};
