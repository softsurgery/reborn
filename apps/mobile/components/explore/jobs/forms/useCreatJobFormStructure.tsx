import React from "react";
import {
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  SelectFieldProps,
  SelectOption,
  TextareaFieldProps,
  TextFieldProps,
} from "~/components/shared/form-builder/types";
import { JobStore } from "~/hooks/stores/useJobStore";
import { ResponseCurrencyDto } from "~/types";

interface JobCreateFormStructureProps {
  jobStore: JobStore;
  currencies: ResponseCurrencyDto[];
  jobTags: SelectOption[];
  jobCategories: SelectOption[];
}

export const useCreateJobFormStructure = ({
  jobStore,
  currencies,
  jobTags,
  jobCategories,
}: JobCreateFormStructureProps) => {
  const selectedCurrency = React.useMemo(() => {
    return currencies.find(
      (currency) => currency.id === jobStore.createDto.currencyId
    );
  }, [currencies, jobStore.createDto.currencyId]);

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: "Job Title",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter job title",
    description: "A short and clear title for the job post.",
    error: jobStore.createDtoErrors?.title?.[0],
    props: {
      value: jobStore.createDto.title,
      onChangeText: (value) => {
        jobStore.setNested("createDto.title", value);
        jobStore.setNested("createDtoErrors.title", []);
      },
    },
  };

  const descriptionField: Field<TextareaFieldProps> = {
    id: "description",
    label: "Description",
    variant: FieldVariant.TEXTAREA,
    required: true,
    placeholder: "Write a detailed description of the job",
    description: "Provide a full description of the project or role.",
    error: jobStore.createDtoErrors?.description?.[0],
    props: {
      value: jobStore.createDto.description,
      rows: 8,
      onChangeText: (value) => {
        jobStore.setNested("createDto.description", value);
        jobStore.setNested("createDtoErrors.description", []);
      },
    },
  };

  const priceField: Field<NumberFieldProps> = {
    id: "price",
    label: "Budget",
    variant: FieldVariant.NUMBER,
    required: true,
    placeholder: "Enter budget amount",
    description: "Set the budget for this job.",
    error: jobStore.createDtoErrors?.price?.[0],
    props: {
      value: jobStore.createDto?.price || undefined,
      onChangeText: (value) => {
        if (
          value == Number(value.toFixed(selectedCurrency?.digitsAfterComma))
        ) {
          jobStore.setNested("createDto.price", Number(value));
          jobStore.setNested("createDtoErrors.price", []);
        }
      },
    },
  };

  //   const currencyField: Field<SelectFieldProps> = {
  //     id: "currency",
  //     label: "Currency",
  //     variant: FieldVariant.SELECT,
  //     required: true,
  //     description: "Select the currency for the budget.",
  //     placeholder: "Choose currency",
  //     error: jobStore.createDtoErrors?.currencyId?.[0],
  //     props: {
  //       options: currencies.map((currency) => ({
  //         label: `${currency.label} (${currency.symbol})`,
  //         value: currency.id.toString(),
  //       })),
  //       value: jobStore.createDto?.currencyId?.toString(),
  //       onSelect: (value: string) => {
  //         jobStore.setNested("createDto.currencyId", value);
  //         jobStore.setNested("createDtoErrors.currencyId", []);
  //       },
  //     },
  //   };

  //   const uploadsField: Field<ImageGalleryFieldProps> = {
  //     id: "uploads",
  //     label: "Uploads",
  //     variant: FieldVariant.IMAGE_GALLERY,
  //     props: {
  //       images: jobStore.images,
  //       onFilesChange: (e: ImageFile[]) => {
  //         jobStore.updateImages("create", e);
  //       },
  //       onUpload: (file, onProgress) => {
  //         uploadPicture({
  //           files: [file],
  //           onProgress: (progress: number) => {
  //             jobStore.setImageProgress(file, progress);
  //             onProgress(progress);
  //           },
  //         });
  //       },
  //     },
  //   };

  //   const jobTagsField: Field<MultiSelectFieldProps> = {
  //     id: "tags",
  //     label: "Tags",
  //     variant: FieldVariant.MULTI_SELECT,
  //     required: true,
  //     description: "Select tags related to this job.",
  //     placeholder: "Choose tags",
  //     error: jobStore.createDtoErrors?.tags?.[0],
  //     props: {
  //       options: jobTags,
  //       value: jobTags.filter((option: SelectOption) =>
  //         jobStore.createDto?.tagIds?.includes(Number(option.value))
  //       ),
  //       onChange: (value) => {
  //         jobStore.setNested(
  //           "createDto.tagIds",
  //           value.map((v) => Number(v.value))
  //         );
  //         jobStore.setNested("createDtoErrors.tagIds", []);
  //       },
  //     },
  //   };

  const jobCategoriesField: Field<SelectFieldProps> = {
    id: "categories",
    label: "Category",
    variant: FieldVariant.SELECT,
    required: true,
    description: "Select a category for the job.",
    placeholder: "Choose category",
    error: jobStore.createDtoErrors?.categoryId?.[0],
    props: {
      options: jobCategories,
      value: jobStore.createDto?.categoryId?.toString(),
      onSelect: (value) => {
        jobStore.setNested("createDto.categoryId", Number(value));
        jobStore.setNested("createDtoErrors.categoryId", []);
      },
    },
  };

  const jobCreateFormStructure: FormStructure = {
    title: "Create New Job",
    description: "Basic information for creating a new job.",
    orientation: "horizontal",
    fieldsets: [
      {
        title: "General Information",
        rows: [
          { id: 1, fields: [titleField] },
          { id: 2, fields: [descriptionField] },
          { id: 3, fields: [priceField] },
          { id: 4, fields: [jobCategoriesField] },
        ],
      },
    ],
  };

  return {
    jobCreateFormStructure,
  };
};
