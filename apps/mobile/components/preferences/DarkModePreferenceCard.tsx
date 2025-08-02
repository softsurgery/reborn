import React from "react";
 import { Text } from "~/components/ui/text";
 import { View } from "react-native";
 import { Switch } from "~/components/ui/switch";
 import { Label } from "~/components/ui/label";
 import { cn } from "~/lib/utils";
 
 interface DarkModePreferenceCardProps {
   onPress: () => void;
   switchState: boolean;
   title?: string;
   subtitle?: string;
   className?: string;
 }
 
 export const DarkModePreferenceCard = ({
   onPress,
   switchState,
   title ,
   subtitle, 
   className,
 }: DarkModePreferenceCardProps) => {
   return (
     <View
       className={cn("flex-row items-center justify-between gap-2", className)}
     >
       <View className="flex flex-col items-start">
         <Label className="text-lg" onPress={onPress}>{title}</Label>
         <Text className="text-sm text-gray-400 dark:text-gray-500">
           {subtitle}
         </Text>
       </View>
       <Switch
         checked={switchState}
         onCheckedChange={onPress}
         className="justify-self-end"
       />
     </View>
   );
 };