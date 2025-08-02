import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { Save } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Toast } from "react-native-toast-notifications";
import { Loader } from "~/components/Loader";
import { Button } from "~/components/ui/button";
import { firebaseFns } from "~/firebase";
import { useUpdateProfileManager } from "~/hooks/stores/useUpdateProfileManager";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import Icon from "~/lib/Icon";
import { Result, User } from "~/types";
import { NavigationProps } from "~/types/app.routes";
import { Text } from "~/components/ui/text";

export const UpdateProfile = () => {
  const { currentUser, isFetchingCurrentUser } = useCurrentUser();
  const updateProfileManager = useUpdateProfileManager();
  const navigation = useNavigation<NavigationProps>();
  const [image, setImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (currentUser) {
      updateProfileManager.setUpdateProfile({
        ...currentUser,
        dateOfBirth: currentUser.dateOfBirth
          ? new Date(currentUser.dateOfBirth)
          : new Date(),
      });
    }
  }, [currentUser]);

  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useMutation({
      mutationFn: (data: Partial<User>) => firebaseFns.user.updateCurrent(data),
      onSuccess: (result: Result) => {
        if (result.success) {
          Toast.show("Profile Updated Successfully", {
            successColor: "#00FF00",
          });
          navigation.goBack();
        } else {
          Toast.show(JSON.stringify(result));
        }
      },
    });

  // const form = React.useMemo(
  //   (): FormStructure => ({
  //     title: "Update Your Profile",
  //     description: "Make changes to your profile information below",
  //     orientation: "horizontal",
  //     fieldsets: [
  //       {
  //         title: "General Information",
  //         rows: [
  //           {
  //             id: 1,
  //             fields: [
  //               {
  //                 label: "Profile Picture",
  //                 variant: FieldVariant.PICTURE,
  //                 description:
  //                   "Upload a profile picture to personalize your account.",
  //                 props: {
  //                   value: image || undefined,
  //                   onValueChange: (value) =>
  //                     setImage((value as string) || null),
  //                 },
  //               },
  //             ],
  //           },
  //           {
  //             id: 2,
  //             fields: [
  //               {
  //                 label: "Name",
  //                 variant: "text",
  //                 required: true,
  //                 placeholder: "Enter your name",
  //                 disabled: isUpdateProfilePending,
  //                 description: "Your first name (e.g., John).",
  //                 props: {
  //                   value: updateProfileManager.name,
  //                   onChangeText: (value: string) =>
  //                     updateProfileManager.set("name", value),
  //                 },
  //               },
  //               {
  //                 label: "Surname",
  //                 variant: "text",
  //                 required: true,
  //                 placeholder: "Enter your surname",
  //                 disabled: isUpdateProfilePending,
  //                 description: "Your last name (e.g., Doe).",
  //                 props: {
  //                   value: updateProfileManager.surname,
  //                   onChangeText: (value: string) =>
  //                     updateProfileManager.set("surname", value),
  //                 },
  //               },
  //             ],
  //           },
  //           {
  //             id: 3,
  //             fields: [
  //               {
  //                 label: "E-mail",
  //                 variant: "email",
  //                 required: true,
  //                 placeholder: "your.email@example.com",
  //                 disabled: isUpdateProfilePending,
  //                 description:
  //                   "We'll use this email for important communication.",
  //                 props: {
  //                   value: updateProfileManager.email,
  //                   onChangeText: (value: string) =>
  //                     updateProfileManager.set("email", value),
  //                 },
  //               },
  //               {
  //                 label: "Phone",
  //                 variant: "tel",
  //                 required: true,
  //                 placeholder: "Enter your phone number",
  //                 disabled: isUpdateProfilePending,
  //                 description:
  //                   "Enter a phone number so we can reach you if needed.",
  //                 props: {
  //                   value: updateProfileManager.phone,
  //                   onChangeText: (value: string) =>
  //                     updateProfileManager.set("phone", value),
  //                 },
  //               },
  //             ],
  //           },
  //           {
  //             id: 7,
  //             fields: [
  //               {
  //                 label: "Date of Birth",
  //                 variant: "date",
  //                 disabled: isUpdateProfilePending,
  //                 description: "Let us know when you celebrate!",
  //                 props: {
  //                   value: updateProfileManager.dateOfBirth,
  //                   onDateChange: (date: Date | null) =>
  //                     updateProfileManager.set("dateOfBirth", date),
  //                 },
  //               },
  //             ],
  //           },
  //           {
  //             id: 6,
  //             fields: [
  //               {
  //                 label: "Gender",
  //                 variant: "double-choice",
  //                 disabled: isUpdateProfilePending,
  //                 description:
  //                   "Specifying your gender helps us personalize your experience.",
  //                 props: {
  //                   pChoice: "Male",
  //                   positiveChoice: true,
  //                   nChoice: "Female",
  //                   negativeChoice: false,
  //                   value: updateProfileManager.isMale,
  //                   onValueChange: (value: string | number | boolean) =>
  //                     updateProfileManager.set("isMale", value as boolean),
  //                 },
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         name: "Additional Information",
  //         gridItems: [
  //           {
  //             id: 5,
  //             fields: [
  //               {
  //                 label: "Bio",
  //                 variant: "textarea",
  //                 placeholder: "Write a short bio...",
  //                 disabled: isUpdateProfilePending,
  //                 description: "Tell us a little bit about yourself.",
  //                 props: {
  //                   value: updateProfileManager.bio,
  //                   onChangeText: (value: string) =>
  //                     updateProfileManager.set("bio", value),
  //                 },
  //               },
  //             ],
  //           },
  //           {
  //             id: 8,
  //             fields: [
  //               {
  //                 label: "Region",
  //                 variant: "select",
  //                 disabled: isUpdateProfilePending,
  //                 description: "Select the region where you are located.",
  //                 props: {
  //                   selectOptions: tunisianGovernorates.map((region) => ({
  //                     label: region,
  //                     value: region,
  //                   })),
  //                   value: updateProfileManager.region,
  //                   onValueChange: (value: string | number | boolean) =>
  //                     updateProfileManager.set("region", value),
  //                 },
  //               },
  //             ],
  //           },
  //           {
  //             id: 9,
  //             fields: [
  //               {
  //                 label: "Profile Visibility",
  //                 variant: "double-choice",
  //                 disabled: isUpdateProfilePending,
  //                 description: "Control who can see your profile information.",
  //                 props: {
  //                   pChoice: "Public",
  //                   positiveChoice: true,
  //                   nChoice: "Private",
  //                   negativeChoice: false,
  //                   value: updateProfileManager.isPublic,
  //                   onValueChange: (value: string | number | boolean) =>
  //                     updateProfileManager.set("isPublic", value as boolean),
  //                 },
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   }),
  //   [updateProfileManager, isUpdateProfilePending, image]
  // );

  const handleUpdate = async () => {
    const updatedData: Partial<User> = {
      name: updateProfileManager.name,
      surname: updateProfileManager.surname,
      email: updateProfileManager.email,
      phone: updateProfileManager.phone,
      bio: updateProfileManager.bio,
      isMale: updateProfileManager.isMale,
      region: updateProfileManager.region,
      dateOfBirth: updateProfileManager.dateOfBirth?.toISOString(),
      nationalId: updateProfileManager.nationalId,
      isPublic: updateProfileManager.isPublic,
    };
    updateProfile(updatedData);
  };

  if (isFetchingCurrentUser) return <Loader />;

  return (
    <KeyboardAwareScrollView bounces={false}>
      <View className="flex flex-col gap-6 mx-4 mb-16">
        {/* <FormBuilder form={form} className="my-4" /> */}

        <Button
          onPress={handleUpdate}
          className="flex flex-row gap-2 w-full"
          disabled={isUpdateProfilePending}
        >
          <Icon name={Save} size={24} />
          <Text>Update Profile</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};
