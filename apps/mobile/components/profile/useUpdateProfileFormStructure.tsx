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

interface useUpdateProfileFormStructureProps {
  store: UserStore;
  regions: SelectOption[];
  uploadPicture: ReturnType<typeof useUploadMutation>["uploadFiles"];
  isUploadPending?: boolean;
}

export const useUpdateProfileFormStructure = ({
  store,
  regions,
  uploadPicture,
  isUploadPending,
}: useUpdateProfileFormStructureProps) => {
  // picture
  const pictureField: Field<PictureFieldProps> = {
    id: "picture",
    label: "Profile Picture",
    variant: FieldVariant.PICTURE,
    description: "Upload a profile picture to personalize your account.",
    props: {
      image: store?.picture,
      alt: "Profile Picture",
      editable: !isUploadPending,
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
    label: "First Name",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter your first name",
    disabled: false,
    description: "Your first name (e.g., John).",
    error: store.errors?.firstName?.[0],
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
    label: "Last Name",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter your last name",
    disabled: false,
    description: "Your last name (e.g., Doe).",
    error: store.errors?.lastName?.[0],
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
    label: "E-mail",
    variant: FieldVariant.EMAIL,
    required: true,
    placeholder: "your.email@example.com",
    disabled: false,
    description: "We'll use this email for important communication.",
    error: store.errors?.email?.[0],
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
    label: "Phone",
    variant: FieldVariant.TEL,
    required: true,
    placeholder: "Enter your phone number",
    disabled: false,
    description: "Enter a phone number so we can reach you if needed.",
    error: store.errors?.phone?.[0],
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
    label: "Date of Birth",
    variant: FieldVariant.DATE,
    disabled: false,
    description: "Let us know when you celebrate!",
    error: store.errors?.dateOfBirth?.[0],
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
    label: "Bio",
    variant: FieldVariant.TEXTAREA,
    placeholder: "Write a short bio...",
    disabled: false,
    description: "Tell us a little bit about yourself.",
    error: store.errors?.bio?.[0],
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
    label: "Region",
    variant: FieldVariant.SELECT,
    disabled: false,
    description: "Select the region where you are located.",
    error: store.errors?.regionId?.[0],
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
    label: "Private Profile",
    variant: FieldVariant.CHECKBOX,
    disabled: false,
    description: "Check to make your profile private",
    error: store.errors?.isPrivate?.[0],
    props: {
      label: "Do not show my profile to others",
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
    label: "Gender",
    variant: FieldVariant.SELECT,
    disabled: false,
    description: "Specifying your gender helps us personalize your experience.",
    error: store.errors?.gender?.[0],
    props: {
      value: store.updateDto?.gender?.toString(),
      onSelect: (value: string) => {
        store.setNested("updateDto.gender", value);
        store.setNested("errors.gender", []);
      },
      options: Object.entries(Gender).map(([value, label]) => ({
        label: label as string,
        value,
      })),
    },
  };

  const updateProfileStructure: FormStructure = {
    title: "Update Your Profile",
    description: "Make changes to your profile information below",
    orientation: "horizontal",
    fieldsets: [
      {
        title: "General Information",
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
        title: "Additional Information",
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

  return { updateProfileStructure };
};
