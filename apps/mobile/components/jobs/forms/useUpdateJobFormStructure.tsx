import { useUploadMutation } from "@/hooks/content/useUploadMutation";
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
  CheckboxFieldProps,
} from "@reborn/mobile-form-builder";
import { JobStore } from "@/hooks/stores/useJobStore";
import {
  JobDifficulty,
  JobStyle,
} from "@/types";
import { useTranslation } from "@reborn/i18n";

interface JobUpdateFormStructureProps {
  jobStore: JobStore;
  jobTags: SelectOption[];
  jobCategories: SelectOption[];
  uploadPicture: ReturnType<typeof useUploadMutation>["uploadFiles"];
}

export const useUpdateJobFormStructure = ({
  jobStore,
  jobTags,
  jobCategories,
  uploadPicture,
}: JobUpdateFormStructureProps) => {
  const { t } = useTranslation("jobs");

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: t("form.fields.title.label"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("form.fields.title.placeholder"),
    description: t("form.fields.title.description"),
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
    label: t("form.fields.description.label"),
    variant: FieldVariant.TEXTAREA,
    required: true,
    placeholder: t("form.fields.description.placeholder"),
    description: t("form.fields.description.description"),
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
    label: t("form.fields.budget.label"),
    variant: FieldVariant.NUMBER,
    required: true,
    placeholder: t("form.fields.budget.placeholder"),
    description: t("form.fields.budget.description"),
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
    label: t("form.fields.pricingType.label"),
    variant: FieldVariant.SELECT,
    required: true,
    placeholder: t("form.fields.pricingType.placeholder"),
    description: t("form.fields.pricingType.description"),
    error: jobStore.updateDtoErrors?.pricingType?.[0],
    props: {
      options: [
        { label: t("form.fields.pricingType.fixed"), value: "fixed" },
        { label: t("form.fields.pricingType.hourly"), value: "hourly" },
      ],
      value: jobStore.updateDto?.pricingType,
      onSelect: (value) => {
        jobStore.setNested("updateDto.pricingType", value);
        jobStore.setNested("updateDtoErrors.pricingType", []);
      },
    },
  };

  const negotiablePriceField: Field<CheckboxFieldProps> = {
    id: "negotiablePrice",
    label: t("form.fields.negotiable.label"),
    variant: FieldVariant.CHECKBOX,
    required: false,
    className: "mt-2",
    description: t("form.fields.negotiable.description"),
    error: jobStore.updateDtoErrors?.negotiablePrice?.[0],
    props: {
      checked: jobStore.updateDto?.negotiablePrice || false,
      onCheckedChange: (checked) => {
        jobStore.setNested("updateDto.negotiablePrice", checked);
        jobStore.setNested("updateDtoErrors.negotiablePrice", []);
      },
    },
  };

  const jobCategoryField: Field<SelectFieldProps> = {
    id: "category",
    label: t("form.fields.category.label"),
    variant: FieldVariant.SELECT,
    required: true,
    description: t("form.fields.category.description"),
    placeholder: t("form.fields.category.placeholder"),
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
    label: t("form.fields.style.label"),
    variant: FieldVariant.SELECT,
    required: true,
    placeholder: t("form.fields.style.placeholder"),
    description: t("form.fields.style.description"),
    error: jobStore.updateDtoErrors?.style?.[0],
    props: {
      options: Object.entries(JobStyle).map(([_key, value]) => ({
        label: t(`form.options.style.${value}`, { defaultValue: value }),
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
    label: t("form.fields.difficulty.label"),
    variant: FieldVariant.SELECT,
    required: true,
    placeholder: t("form.fields.difficulty.placeholder"),
    description: t("form.fields.difficulty.description"),
    error: jobStore.updateDtoErrors?.difficulty?.[0],
    props: {
      options: Object.entries(JobDifficulty).map(([_key, value]) => ({
        label: t(`form.options.difficulty.${value}`, { defaultValue: value }),
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
    label: t("form.fields.tags.label"),
    variant: FieldVariant.MULTISELECT,
    required: true,
    placeholder: t("form.fields.tags.placeholder"),
    description: t("form.fields.tags.description"),
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
    label: t("form.fields.location.label"),
    variant: FieldVariant.MAPPIN,
    required: false,
    description: t("form.fields.location.description"),
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
    title: t("form.sections.define.title"),
    description: t("form.sections.define.description"),
    orientation: "horizontal",
    fieldsets: [
      {
        title: t("form.sections.general"),
        rows: [
          { id: 1, fields: [titleField] },
          { id: 2, fields: [descriptionField] },
          { id: 3, fields: [priceField,pricingTypeField, negotiablePriceField] },
          { id: 5, fields: [locationField] },
        ],
      },
    ],
  };

  const jobDetailsFormStructure: FormStructure = {
    title: t("form.sections.details.title"),
    description: t("form.sections.details.description"),
    orientation: "horizontal",
    fieldsets: [
      {
        title: t("form.sections.details.fieldset"),
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
    label: t("form.fields.images.label"),
    variant: FieldVariant.GALLERY,
    required: true,
    error: jobStore.updateDtoErrors?.uploads?.[0],
    description: t("form.fields.images.description"),
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
    title: t("form.sections.images.title"),
    description: t("form.sections.images.description"),
    orientation: "horizontal",
    fieldsets: [
      {
        title: t("form.sections.images.fieldset"),
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
