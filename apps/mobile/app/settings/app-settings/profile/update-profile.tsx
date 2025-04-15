// import React from "react";
// import { View } from "react-native";
// import { Button } from "~/components/ui/button";
// import { Input } from "~/components/ui/input";
// import { Text } from "~/components/ui/text";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { PictureUploader } from "~/components/common/PictureUploader";
// import { Label } from "~/components/ui/label";
// import { Textarea } from "~/components/ui/textarea";
// import { DatePicker } from "~/components/ui/date-picker";
// import { useUpdateProfileManager } from "./hooks/useUpdateProfileManager";
// import { firebaseFns } from "~/firebase";
// import { useCurrentUser } from "~/hooks/useCurrentUser";
// import { Loader } from "~/components/Loader";
// import Select from "~/components/common/Select";
// import { tunisianGovernorates } from "~/constants/cities";
// import { DoubleChoice } from "~/components/common/DoubleChoice";
// import { IconWithTheme } from "~/lib/IconWithTheme";
// import { Save } from "lucide-react-native";
// import { useMutation } from "@tanstack/react-query";
// import { Result, User } from "~/types";
// import { Toast } from "react-native-toast-notifications";
// import { NavigationProps } from "~/types/app.routes";
// import { useNavigation } from "expo-router";

// export default function UpdateProfile() {
//   const [image, setImage] = React.useState<string | null>(null);
//   const { currentUser, isFetchingCurrentUser } = useCurrentUser();
//   const updateProfileManager = useUpdateProfileManager();
//   const navigation = useNavigation<NavigationProps>();

//   //initialize the profile data with the current user data
//   React.useEffect(() => {
//     if (currentUser) {
//       updateProfileManager.setUpdateProfile({
//         ...currentUser,
//         dateOfBirth: currentUser.dateOfBirth
//           ? new Date(currentUser.dateOfBirth)
//           : new Date(),
//       });
//     }
//   }, [currentUser]);

//   const handleUpdate = async () => {
//     // try {
//     const updatedData: Partial<User> = {
//       name: updateProfileManager.name,
//       surname: updateProfileManager.surname,
//       email: updateProfileManager.email,
//       phone: updateProfileManager.phone,
//       bio: updateProfileManager.bio,
//       isMale: updateProfileManager.isMale,
//       region: updateProfileManager.region,
//       dateOfBirth: updateProfileManager.dateOfBirth?.toISOString(),
//       nationalId: updateProfileManager.nationalId,
//       isPublic: updateProfileManager.isPublic,
//     };
//     updateProfile(updatedData);
//   };

//   const { mutate: updateProfile, isPending: isUpdateProfilePending } =
//     useMutation({
//       mutationFn: (data: Partial<User>) => firebaseFns.user.updateCurrent(data),
//       onSuccess: (result: Result) => {
//         if (result.success) {
//           Toast.show("Profile Updated Successfully", {
//             successColor: "#00FF00",
//           });
//           navigation.goBack();
//         } else {
//           Toast.show(JSON.stringify(result));
//         }
//       },
//     });

//   if (isFetchingCurrentUser) return <Loader />;
//   return (
//     <KeyboardAwareScrollView bounces={false}>
//       <View className="flex flex-col gap-6 px-5 mb-16">
//         <PictureUploader image={image} onChange={setImage} />

//         <View className="flex flex-row gap-4 justify-center mt-5 mx-2">
//           <View className="flex flex-col gap-2 w-1/2">
//             <Label className="text-base font-bold">Name</Label>
//             <Input
//               editable={!isUpdateProfilePending}
//               placeholder="Name"
//               value={updateProfileManager.name}
//               onChangeText={(value) => updateProfileManager.set("name", value)}
//             />
//             <Text className="text-sm text-gray-500 font-thin">
//               Enter your first name.
//             </Text>
//           </View>
//           <View className="flex flex-col gap-2 w-1/2">
//             <Label className="text-base font-bold">Surname</Label>
//             <Input
//               editable={!isUpdateProfilePending}
//               placeholder="Surname"
//               value={updateProfileManager.surname}
//               onChangeText={(value) =>
//                 updateProfileManager.set("surname", value)
//               }
//             />
//             <Text className="text-sm text-gray-500 font-thin">
//               Enter your last name.
//             </Text>
//           </View>
//         </View>

//         <View className="flex flex-col gap-2">
//           <Label className="text-base font-bold">E-mail</Label>
//           <Input
//             editable={!isUpdateProfilePending}
//             placeholder="Email"
//             keyboardType="email-address"
//             value={updateProfileManager.email}
//             onChangeText={(value) => updateProfileManager.set("email", value)}
//           />
//           <Text className="text-sm text-gray-500 font-thin">
//             Provide a valid email address.
//           </Text>
//         </View>

//         <View className="flex flex-col gap-2">
//           <Label className="text-base font-bold">Phone</Label>
//           <Input
//             editable={!isUpdateProfilePending}
//             placeholder="Phone"
//             keyboardType="phone-pad"
//             value={updateProfileManager.phone}
//             onChangeText={(value) => updateProfileManager.set("phone", value)}
//           />
//           <Text className="text-sm text-gray-500 font-thin">
//             Enter your mobile phone number.
//           </Text>
//         </View>

//         <View className="flex flex-col gap-2">
//           <Label className="text-base font-bold">Bio</Label>
//           <Textarea
//             className="h-52"
//             editable={!isUpdateProfilePending}
//             value={updateProfileManager.bio}
//             onChangeText={(value) => updateProfileManager.set("bio", value)}
//           />
//           <Text className="text-sm text-gray-500 font-thin">
//             Write a short description about yourself.
//           </Text>
//         </View>

//         <View className="flex flex-col gap-2 w-full">
//           <Label className="text-base font-bold">Gender</Label>
//           <DoubleChoice
//             disabled={isUpdateProfilePending}
//             positiveChoice={{ label: "Male", value: true }}
//             negativeChoice={{ label: "Female", value: false }}
//             value={updateProfileManager.isMale}
//             onChange={(value) => updateProfileManager.set("isMale", value)}
//           />
//           <Text className="text-sm text-gray-500 font-thin">
//             Choose your gender to personalize your experience.
//           </Text>
//         </View>

//         <View className="flex flex-col gap-2 w-full">
//           <Label className="text-base font-bold">Date of Birth</Label>
//           <DatePicker
//             date={updateProfileManager.dateOfBirth || new Date()}
//             disabled={isUpdateProfilePending}
//             onChange={(date) => updateProfileManager.set("dateOfBirth", date)}
//           />
//           <Text className="text-sm text-gray-500 font-thin">
//             Select your birth date.
//           </Text>
//         </View>

//         <View className="flex flex-col gap-2 w-full">
//           <Label className="text-base font-bold">Region</Label>
//           <Select
//             disabled={isUpdateProfilePending}
//             title="Select Region"
//             description="Select the Region You're Located In"
//             value={updateProfileManager.region}
//             onSelect={(value) => updateProfileManager.set("region", value)}
//             options={tunisianGovernorates.map((region) => ({
//               label: region,
//               value: region,
//             }))}
//           />
//           <Text className="text-sm text-gray-500 font-thin">
//             Choose the region you live in.
//           </Text>
//         </View>

//         <View className="flex flex-col gap-2 w-full">
//           <Label className="text-base font-bold">Profile Visibility</Label>
//           <DoubleChoice
//             disabled={isUpdateProfilePending}
//             positiveChoice={{ label: "Public Profile", value: true }}
//             negativeChoice={{ label: "Private Profile", value: false }}
//             value={updateProfileManager.isPublic}
//             onChange={(value) => updateProfileManager.set("isPublic", value)}
//           />
//           <Text className="text-sm text-gray-500 font-thin">
//             Choose whether your profile should be public or private.
//           </Text>
//         </View>

//         <Button
//           onPress={handleUpdate}
//           className="flex flex-row gap-2 w-full"
//           disabled={isUpdateProfilePending}
//         >
//           <IconWithTheme icon={Save} size={24} className="mt-1" reverse />
//           <Text className="dark:text-black text-white">UPDATE</Text>
//         </Button>
//       </View>
//     </KeyboardAwareScrollView>
//   );
// }

import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useUpdateProfileManager } from "./hooks/useUpdateProfileManager";
import { firebaseFns } from "~/firebase";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { Loader } from "~/components/Loader";
import { tunisianGovernorates } from "~/constants/cities";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { Save } from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import { Result, User } from "~/types";
import { Toast } from "react-native-toast-notifications";
import { NavigationProps } from "~/types/app.routes";
import { useNavigation } from "expo-router";
import { DynamicForm } from "~/types/utils/form-builder";
import { FormBuilder } from "~/components/common/form-builder/FormBuilder";

export default function UpdateProfile() {
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

  const form = React.useMemo(
    (): DynamicForm => ({
      name: "Update Your Profile",
      description: "Make changes to your profile information below",
      grids: [
        {
          name: "",
          gridItems: [
            {
              id: 1,
              fields: [
                {
                  label: "Profile Picture",
                  variant: "file",
                  description:
                    "Upload a profile picture to personalize your account.",
                  props: {
                    value: image || undefined,
                    onValueChange: (value) =>
                      setImage((value as string) || null),
                  },
                },
              ],
            },
            {
              id: 2,
              fields: [
                {
                  label: "Name",
                  variant: "text",
                  required: true,
                  placeholder: "Enter your name",
                  disabled: isUpdateProfilePending,
                  description: "Your first name (e.g., John).",
                  props: {
                    value: updateProfileManager.name,
                    onChangeText: (value: string) =>
                      updateProfileManager.set("name", value),
                  },
                },
              ],
            },
            {
              id: 3,
              fields: [
                {
                  label: "Surname",
                  variant: "text",
                  required: true,
                  placeholder: "Enter your surname",
                  disabled: isUpdateProfilePending,
                  description: "Your last name (e.g., Doe).",
                  props: {
                    value: updateProfileManager.surname,
                    onChangeText: (value: string) =>
                      updateProfileManager.set("surname", value),
                  },
                },
              ],
            },
            {
              id: 4,
              fields: [
                {
                  label: "E-mail",
                  variant: "email",
                  required: true,
                  placeholder: "your.email@example.com",
                  disabled: isUpdateProfilePending,
                  description:
                    "We'll use this email for important communication.",
                  props: {
                    value: updateProfileManager.email,
                    onChangeText: (value: string) =>
                      updateProfileManager.set("email", value),
                  },
                },
              ],
            },
            {
              id: 5,
              fields: [
                {
                  label: "Phone",
                  variant: "tel",
                  required: true,
                  placeholder: "Enter your phone number",
                  disabled: isUpdateProfilePending,
                  description:
                    "Enter a phone number so we can reach you if needed.",
                  props: {
                    value: updateProfileManager.phone,
                    onChangeText: (value: string) =>
                      updateProfileManager.set("phone", value),
                  },
                },
              ],
            },
            {
              id: 6,
              fields: [
                {
                  label: "Bio",
                  variant: "textarea",
                  placeholder: "Write a short bio...",
                  disabled: isUpdateProfilePending,
                  description: "Tell us a little bit about yourself.",
                  props: {
                    value: updateProfileManager.bio,
                    onChangeText: (value: string) =>
                      updateProfileManager.set("bio", value),
                  },
                },
              ],
            },
            {
              id: 7,
              fields: [
                {
                  label: "Gender",
                  variant: "double-choice",
                  disabled: isUpdateProfilePending,
                  description:
                    "Specifying your gender helps us personalize your experience.",
                  props: {
                    pChoice: "Male",
                    positiveChoice: true,
                    nChoice: "Female",
                    negativeChoice: false,
                    value: updateProfileManager.isMale,
                    onValueChange: (value: string | number | boolean) =>
                      updateProfileManager.set("isMale", value as boolean),
                  },
                },
              ],
            },
            {
              id: 8,
              fields: [
                {
                  label: "Date of Birth",
                  variant: "date",
                  disabled: isUpdateProfilePending,
                  description: "Let us know when you celebrate!",
                  props: {
                    value: updateProfileManager.dateOfBirth,
                    onDateChange: (date: Date | null) =>
                      updateProfileManager.set("dateOfBirth", date),
                  },
                },
              ],
            },
            {
              id: 9,
              fields: [
                {
                  label: "Region",
                  variant: "select",
                  disabled: isUpdateProfilePending,
                  description: "Select the region where you are located.",
                  props: {
                    selectOptions: tunisianGovernorates.map((region) => ({
                      label: region,
                      value: region,
                    })),
                    value: updateProfileManager.region,
                    onValueChange: (value: string | number | boolean) =>
                      updateProfileManager.set("region", value),
                  },
                },
              ],
            },
            {
              id: 10,
              fields: [
                {
                  label: "Profile Visibility",
                  variant: "double-choice",
                  disabled: isUpdateProfilePending,
                  description: "Control who can see your profile information.",
                  props: {
                    pChoice: "Public",
                    positiveChoice: true,
                    nChoice: "Private",
                    negativeChoice: false,
                    value: updateProfileManager.isPublic,
                    onValueChange: (value: string | number | boolean) =>
                      updateProfileManager.set("isPublic", value as boolean),
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
    [updateProfileManager, isUpdateProfilePending, image]
  );

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
        <FormBuilder form={form} />

        <Button
          onPress={handleUpdate}
          className="flex flex-row gap-2 w-full"
          disabled={isUpdateProfilePending}
        >
          <IconWithTheme icon={Save} size={24} className="mt-1" reverse />
          <Text className="dark:text-black text-white">UPDATE</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
