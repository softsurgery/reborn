import React from "react";
 import { Text } from "~/components/ui/text";
 import { View } from "react-native";
 import { Label } from "~/components/ui/label";
 import { cn } from "~/lib/utils";
 import Select from "../common/Select";
 
 interface LanguagePreferenceCardProps {
   className?: string;
   onSelect?: (value: string) => void;
   options?: { label: string; value: string }[];
   value?: string;
 }
 
 export const LanguagePreferenceCard = ({
   className,
   onSelect,
   options,
   value,
 }: LanguagePreferenceCardProps) => {
   return (
     <View
       className={cn("flex-row items-center justify-between gap-2", className)}
     >
       <View className="flex flex-col items-start">
         <Label>Select Language</Label>
         <Text className="text-sm text-gray-400 dark:text-gray-500">
           Choose your preferred language
         </Text>
       </View>
       <Select
         title="Select Language"
         description="Select the Language your prefer"
         options={options}
         onSelect={onSelect}
         value={value}
       />
     </View>
   );
 };