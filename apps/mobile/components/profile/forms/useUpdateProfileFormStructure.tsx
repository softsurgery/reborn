import {
  CheckboxFieldProps,
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  PictureFieldProps,
  SelectFieldProps,
  SelectOption,
  TextareaFieldProps,
  TextFieldProps,
} from "~/components/shared/form-builder/types";
import { UserStore } from "~/hooks/stores/useUserStore";
import { useUploadMutation } from "~/hooks/content/useUploadMutation";
import { Gender } from "~/types";
import { useTranslation } from "react-i18next";

interface useUpdateProfileFormStructureProps {
  store: UserStore;
  fallback?: string;
  regions: SelectOption[];
  uploadPicture: ReturnType<typeof useUploadMutation>["uploadFiles"];
  isProfilePictureUploadPending?: boolean;
}

export const useUpdateProfileFormStructure = ({
  store,
  regions,
  fallback,
  uploadPicture,
  isProfilePictureUploadPending,
}: useUpdateProfileFormStructureProps) => {
  const { t } = useTranslation("settings");

  // picture
  const pictureField: Field<PictureFieldProps> = {
    id: "picture",
    label: t("settings.account.screens.profile.form.profile-picture"),
    variant: FieldVariant.PICTURE,
    description: t(
      "settings.account.screens.profile.form.descriptions.profile-picture",
    ),
    props: {
      image: store?.picture,
      alt: fallback,
      editable: !isProfilePictureUploadPending,
      onFileChange: (value) => {
        store.set("picture", value);
      },
      onUpload: (file, onProgress) => {
        store.set("progress", 0);
        uploadPicture({
          files: [file],
          onProgress: (progress: number) => {
            store.set("progress", progress);
            onProgress(progress);
          },
        });
      },
    },
  };

  //name
  const firstNameField: Field<TextFieldProps> = {
    id: "firstName",
    label: t("settings.account.screens.profile.form.first-name"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t(
      "settings.account.screens.profile.form.placeholders.first-name",
    ),
    disabled: false,
    description: t(
      "settings.account.screens.profile.form.descriptions.first-name",
    ),
    error: t(store.errors.firstName?.[0]),
    props: {
      value: store.updateDto.firstName,
      onChangeText: (value: string) => {
        store.setNested("updateDto.firstName", value);
        store.setNested("errors.firstName", []);
      },
    },
  };

  //surname
  const lastNameField: Field<TextFieldProps> = {
    id: "lastName",
    label: t("settings.account.screens.profile.form.last-name"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t(
      "settings.account.screens.profile.form.placeholders.last-name",
    ),
    disabled: false,
    description: t(
      "settings.account.screens.profile.form.descriptions.last-name",
    ),
    error: t(store.errors.lastName?.[0]),
    props: {
      value: store.updateDto.lastName,
      onChangeText: (value: string) => {
        store.setNested("updateDto.lastName", value);
        store.setNested("errors.lastName", []);
      },
    },
  };

  // email
  const emailField: Field<TextFieldProps> = {
    id: "email",
    label: t("settings.account.screens.profile.form.email"),
    variant: FieldVariant.EMAIL,
    required: true,
    placeholder: t(
      "settings.account.screens.profile.form.placeholders.email",
    ),
    disabled: false,
    description: t(
      "settings.account.screens.profile.form.descriptions.email",
    ),
    error: t(store.errors.email?.[0]),
    props: {
      value: store.updateDto.email,
      onChangeText: (value: string) => {
        store.setNested("updateDto.email", value);
        store.setNested("errors.email", []);
      },
    },
  };

  // phone
  const phoneField: Field<TextFieldProps> = {
    id: "phone",
    label: t("settings.account.screens.profile.form.phone"),
    variant: FieldVariant.TEL,
    required: true,
    placeholder: t(
      "settings.account.screens.profile.form.placeholders.phone",
    ),
    disabled: false,
    description: t(
      "settings.account.screens.profile.form.descriptions.phone",
    ),
    error: t(store.errors.phone?.[0]),
    props: {
      value: store.updateDto?.phone,
      onChangeText: (value: string) => {
        store.setNested("updateDto.phone", value);
        store.setNested("errors.phone", []);
      },
    },
  };

  // date of birth
  const dateOfBirthField: Field<DateFieldProps> = {
    id: "dateOfBirth",
    label: t("settings.account.screens.profile.form.date-of-birth"),
    variant: FieldVariant.DATE,
    disabled: false,
    placeholder: t(
      "settings.account.screens.profile.form.placeholders.date-of-birth",
    ),
    description: t(
      "settings.account.screens.profile.form.descriptions.date-of-birth",
    ),
    error: t(store.errors.dateOfBirth?.[0]),
    props: {
      value: store.updateDto.dateOfBirth || undefined,
      onDateChange: (value: Date) => {
        store.setNested("updateDto.dateOfBirth", value);
        store.setNested("errors.dateOfBirth", []);
      },
    },
  };

  //bio
  const bioField: Field<TextareaFieldProps> = {
    id: "bio",
    label: t("settings.account.screens.profile.form.bio"),
    variant: FieldVariant.TEXTAREA,
    placeholder: t("settings.account.screens.profile.form.placeholders.bio"),
    disabled: false,
    description: t(
      "settings.account.screens.profile.form.descriptions.bio",
    ),
    error: t(store.errors.bio?.[0]),
    props: {
      value: store.updateDto?.bio,
      onChangeText: (value: string) => {
        store.setNested("updateDto.bio", value);
        store.setNested("errors.bio", []);
      },
    },
  };

  //region
  const regionField: Field<SelectFieldProps> = {
    id: "region",
    label: t("settings.account.screens.profile.form.region"),
    variant: FieldVariant.SELECT,
    disabled: false,
    placeholder: t(
      "settings.account.screens.profile.form.placeholders.region",
    ),
    description: t(
      "settings.account.screens.profile.form.descriptions.region",
    ),
    error: t(store.errors.regionId?.[0]),
    props: {
      options: regions,
      value: store.updateDto?.regionId?.toString(),
      onSelect: (value: string) => {
        store.setNested("updateDto.regionId", Number(value));
        store.setNested("errors.regionId", []);
      },
    },
  };

  //visibility
  const isPrivateField: Field<CheckboxFieldProps> = {
    id: "is-public",
    label: t("settings.account.screens.profile.form.private-profile"),
    variant: FieldVariant.CHECKBOX,
    disabled: false,
    description: t(
      "settings.account.screens.profile.form.descriptions.private-profile",
    ),
    error: t(store.errors.isPrivate?.[0]),
    props: {
      label: t(
        "settings.account.screens.profile.form.placeholders.private-profile",
      ),
      checked: store.updateDto?.isPrivate,
      onCheckedChange: (value) => {
        store.setNested("updateDto.isPrivate", value);
        store.setNested("errors.isPrivate", []);
      },
    },
  };

  //gender
  const genderField: Field<SelectFieldProps> = {
    id: "gender",
    label: t("settings.account.screens.profile.form.gender"),
    variant: FieldVariant.SELECT,
    disabled: false,
    placeholder: t(
      "settings.account.screens.profile.form.placeholders.gender",
    ),
    description: t(
      "settings.account.screens.profile.form.descriptions.gender",
    ),
    error: t(store.errors.gender?.[0]),
    props: {
      value: store.updateDto?.gender?.toString(),
      onSelect: (value: string) => {
        store.setNested("updateDto.gender", value);
        store.setNested("errors.gender", []);
      },
      options: Object.entries(Gender).map(([_, value]) => ({
        label: t(
          `settings.account.screens.profile.form.genderOptions.${value}` as any,
          { defaultValue: value },
        ),
        value,
      })),
    },
  };

  const structure: FormStructure = {
    title: t("settings.account.screens.profile.title"),
    description: t("settings.account.screens.profile.description"),
    orientation: "horizontal",
    fieldsets: [
      {
        title: t("settings.account.screens.profile.sections.general"),
        rows: [
          {
            id: 1,
            fields: [pictureField],
          },
          {
            id: 2,
            fields: [firstNameField, lastNameField],
          },
          {
            id: 3,
            fields: [emailField, phoneField],
          },
          {
            id: 4,
            fields: [dateOfBirthField, regionField],
          },
        ],
      },
      {
        title: t("settings.account.screens.profile.sections.additional"),
        rows: [
          {
            id: 5,
            fields: [bioField],
          },
          {
            id: 6,
            fields: [genderField, isPrivateField],
          },
        ],
      },
    ],
  };

  return { structure };
};
