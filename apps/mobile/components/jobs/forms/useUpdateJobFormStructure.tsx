import { useUploadMutation } from "@/hooks/content/useUploadMutation";
import React from "react";
import {
  Field,
  FieldVariant,
  FormStructure,
  GalleryFieldProps,
  ImageFile,
  MapPinFieldProps,
  MultiSelectFieldProps,
  NumberFieldProps,
  SelectFieldProps,
  SelectOption,
  TextareaFieldProps,
  TextFieldProps,
} from "~/components/shared/form-builder/types";
import { JobStore } from "~/hooks/stores/useJobStore";
import {
  CurrencyPayload,
  JobDifficulty,
  JobStyle,
  ResponseRefParamDto,
} from "~/types";

interface JobUpdateFormStructureProps {
  jobStore: JobStore;
  currencies: ResponseRefParamDto<CurrencyPayload>[];
  jobTags: SelectOption[];
  jobCategories: SelectOption[];
  uploadPicture: ReturnType<typeof useUploadMutation>["uploadFiles"];
}

export const useUpdateJobFormStructure = ({
  jobStore,
  currencies,
  jobTags,
  jobCategories,
  uploadPicture,
}: JobUpdateFormStructureProps) => {
  const selectedCurrency = React.useMemo(() => {
    return currencies.find(
      (currency) => currency.id === jobStore.createDto.currencyId,
    );
  }, [currencies, jobStore.createDto.currencyId]);

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: "Job Title",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter job title",
    description: "A short and clear title for the job post.",
    error: jobStore.updateDtoErrors?.title?.[0],
    props: {
      value: jobStore.updateDto?.title,
      onChangeText: (value) => {
        jobStore.setNested("updateDto.title", value);
        jobStore.setNested("updateDtoErrors.title", []);
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
    error: jobStore.updateDtoErrors?.description?.[0],
    props: {
      value: jobStore.updateDto?.description,
      rows: 8,
      onChangeText: (value) => {
        jobStore.setNested("updateDto.description", value);
        jobStore.setNested("updateDtoErrors.description", []);
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
    error: jobStore.updateDtoErrors?.price?.[0],
    props: {
      value: jobStore.updateDto?.price,
      onChangeText: (value) => {
        jobStore.setNested("updateDto.price", value);
        jobStore.setNested("updateDtoErrors.price", []);
      },
    },
  };

  const pricingTypeField: Field<SelectFieldProps> = {
    id: "pricingType",
    label: "Pricing Type",
    variant: FieldVariant.SELECT,
    required: true,
    placeholder: "Select pricing type",
    description: "Choose how you want to be charged for this job.",
    error: jobStore.updateDtoErrors?.pricingType?.[0],
    props: {
      options: [
        { label: "Fixed Price", value: "fixed" },
        { label: "Hourly Rate", value: "hourly" },
      ],
      value: jobStore.updateDto?.pricingType,
      onSelect: (value) => {
        jobStore.setNested("updateDto.pricingType", value);
        jobStore.setNested("updateDtoErrors.pricingType", []);
      },
    },
  };

  const jobCategoryField: Field<SelectFieldProps> = {
    id: "category",
    label: "Category",
    variant: FieldVariant.SELECT,
    required: true,
    description: "Select a category for the job.",
    placeholder: "Choose category",
    error: jobStore.updateDtoErrors?.categoryId?.[0],
    props: {
      options: jobCategories,
      value: jobStore.updateDto?.categoryId?.toString(),
      onSelect: (value) => {
        jobStore.setNested("updateDto.categoryId", Number(value));
        jobStore.setNested("updateDtoErrors.categoryId", []);
      },
    },
  };

  const jobStyleField: Field<SelectFieldProps> = {
    id: "style",
    label: "Style",
    variant: FieldVariant.SELECT,
    required: true,
    placeholder: "Choose style",
    description: "Select a style for the job.",
    error: jobStore.updateDtoErrors?.style?.[0],
    props: {
      options: Object.entries(JobStyle).map(([_key, value]) => ({
        label: value,
        value: value,
      })),
      value: jobStore.updateDto?.style,
      onSelect: (value) => {
        jobStore.setNested("updateDto.style", value);
        jobStore.setNested("updateDtoErrors.style", []);
      },
    },
  };

  const jobDifficultyField: Field<SelectFieldProps> = {
    id: "difficulty",
    label: "Difficulty",
    variant: FieldVariant.SELECT,
    required: true,
    placeholder: "Choose difficulty",
    description: "Select a difficulty for the job.",
    error: jobStore.updateDtoErrors?.difficulty?.[0],
    props: {
      options: Object.entries(JobDifficulty).map(([_key, value]) => ({
        label: value,
        value: value,
      })),
      value: jobStore.updateDto?.difficulty,
      onSelect: (value) => {
        jobStore.setNested("updateDto.difficulty", value);
        jobStore.setNested("updateDtoErrors.difficulty", []);
      },
    },
  };

  const jobTagsField: Field<MultiSelectFieldProps> = {
    id: "tags",
    label: "Tags",
    variant: FieldVariant.MULTISELECT,
    required: false,
    placeholder: "Select relevant tags",
    description: "Add tags to help freelancers find your job.",
    error: jobStore.updateDtoErrors?.tagIds?.[0],
    props: {
      options: jobTags,
      value: jobStore.updateDto?.tagIds?.map(String),
      onSelect: (value) => {
        jobStore.setNested("updateDto.tagIds", value.map(Number));
        jobStore.setNested("updateDtoErrors.tagIds", []);
      },
      searchable: true,
    },
  };

  const locationField: Field<MapPinFieldProps> = {
    id: "location",
    label: "Job Location",
    variant: FieldVariant.MAPPIN,
    required: false,
    description: "Specify the job location (optional).",
    error: jobStore.updateDtoErrors?.location?.[0],
    props: {
      locationName: jobStore.locationName,
      latitude: jobStore.updateDto?.latitude,
      longitude: jobStore.updateDto?.longitude,
      onLocationChange: (location) => {
        jobStore.setNested("updateDto.latitude", location.latitude);
        jobStore.setNested("updateDto.longitude", location.longitude);
        jobStore.set("locationName", location.name);
        jobStore.setNested("updateDtoErrors.location", []);
      },

      editable: true,
    },
  };

  const jobCreateFormStructure: FormStructure = {
    title: "Define The Job",
    description: "Basic information for creating a new job.",
    orientation: "horizontal",
    fieldsets: [
      {
        title: "General Information",
        rows: [
          { id: 1, fields: [titleField] },
          { id: 2, fields: [descriptionField] },
          { id: 3, fields: [priceField] },
          { id: 4, fields: [pricingTypeField] },
          { id: 5, fields: [locationField] },
        ],
      },
    ],
  };

  const jobDetailsFormStructure: FormStructure = {
    title: "Add Job Details",
    description: "Enrich the job listing with more specific information.",
    orientation: "horizontal",
    fieldsets: [
      {
        title: "Job Details",
        rows: [
          { id: 4, fields: [jobCategoryField] },
          { id: 5, fields: [jobStyleField] },
          { id: 6, fields: [jobDifficultyField] },
          { id: 7, fields: [jobTagsField] },
        ],
      },
    ],
  };

  //Step 3 : Pictures ******************************************************************************************* */

  const pictureField: Field<GalleryFieldProps> = {
    id: "pictures",
    label: "Job Images",
    variant: FieldVariant.GALLERY,
    error: jobStore.updateDtoErrors?.uploads?.[0],
    description: "Add images related to the job.",
    props: {
      images: jobStore.images,
      onChange: (images: ImageFile[]) => {
        jobStore.set("images", images);
        jobStore.setNested("updateDtoErrors.uploads", []);
      },
      cols: 3,
      rows: 3,
      editable: true,
      onUpload: async (file, onProgress) => {
        uploadPicture({
          files: [file],
          onProgress: (p) => {
            onProgress(p);
          },
        });
      },
    },
  };

  const jobImagePickerStructure: FormStructure = {
    title: "Add Images",
    description: "Upload images related to the job.",
    orientation: "horizontal",
    fieldsets: [
      {
        title: "Job Images",
        rows: [
          {
            id: 1,
            fields: [pictureField],
          },
        ],
      },
    ],
  };

  return {
    jobCreateFormStructure,
    jobDetailsFormStructure,
    jobImagePickerStructure,
  };
};
