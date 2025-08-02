import {
  DateFieldProps,
  DoubleChoiceFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  PictureFieldProps,
  SelectFieldProps,
  TextareaFieldProps,
  TextFieldProps,
} from "~/components/shared/form-builder/types";

interface useUpdateProfileFormStructureProps {
  store?: any;
}

export const useUpdateProfileFormStructure = ({
  store,
}: useUpdateProfileFormStructureProps) => {
  // picture
  const pictureField: Field<PictureFieldProps> = {
    id: "picture",
    label: "Profile Picture",
    variant: FieldVariant.PICTURE,
    description: "Upload a profile picture to personalize your account.",
    props: {},
  };

  //name
  const nameField: Field<TextFieldProps> = {
    id: "name",
    label: "Name",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter your name",
    disabled: false,
    description: "Your first name (e.g., John).",
    props: {},
  };

  const surnameField: Field<TextFieldProps> = {
    id: "surname",
    label: "Surname",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter your surname",
    disabled: false,
    description: "Your last name (e.g., Doe).",
    props: {},
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
    props: {},
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
    props: {},
  };

  // date of birth
  const dateOfBirthField: Field<DateFieldProps> = {
    id: "date-of-birth",
    label: "Date of Birth",
    variant: FieldVariant.DATE,
    disabled: false,
    description: "Let us know when you celebrate!",
    props: {},
  };

  //gender
  const genderField: Field<DoubleChoiceFieldProps> = {
    id: "gender",
    label: "Gender",
    variant: FieldVariant.DOUBLE_CHOICE,
    disabled: false,
    description: "Specifying your gender helps us personalize your experience.",
  };

  //bio
  const bioField: Field<TextareaFieldProps> = {
    id: "bio",
    label: "Bio",
    variant: FieldVariant.TEXTAREA,
    placeholder: "Write a short bio...",
    disabled: false,
    description: "Tell us a little bit about yourself.",
    props: {},
  };

  //region
  const regionField: Field<SelectFieldProps> = {
    id: "region",
    label: "Region",
    variant: FieldVariant.SELECT,
    disabled: false,
    description: "Select the region where you are located.",
    props: {},
  };

  //visibility
  const isPublicField: Field<DoubleChoiceFieldProps> = {
    id: "is-public",
    label: "Profile Visibility",
    variant: FieldVariant.DOUBLE_CHOICE,
    disabled: false,
    description: "Control who can see your profile information.",
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
            fields: [nameField, surnameField],
          },
          {
            id: 3,
            fields: [emailField, phoneField],
          },
          {
            id: 4,
            fields: [dateOfBirthField, genderField],
          },
        ],
      },
      {
        title: "Additional Information",
        rows: [
          {
            id: 5,
            fields: [bioField, regionField],
          },
          {
            id: 6,
            fields: [isPublicField],
          },
        ],
      },
    ],
  };

  return { updateProfileStructure };
};
