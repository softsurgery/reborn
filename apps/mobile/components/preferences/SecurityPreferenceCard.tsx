import React from "react";
 import { Text } from "~/components/ui/text";
 import { View } from "react-native";
 import { Label } from "~/components/ui/label";
 import { cn } from "~/lib/utils";
 import { ChevronRight } from "lucide-react-native";
 import { Pressable } from "react-native";
 
 interface SecurityPreferenceCardProps {
   onPress?: () => void;
   className?: string;
 }
 
 export const SecurityPreferenceCard = ({ onPress, className }: SecurityPreferenceCardProps) => {
   return (
     <Pressable onPress={onPress}>
       <View className={cn("flex-row items-center justify-between gap-2", className)}>
         <View className="flex flex-col items-start">
           <Label className="text-lg">Account Security</Label>
           <Text className="text-sm text-gray-400 dark:text-gray-500">
             Manage your password and security settings
           </Text>
         </View>
         <ChevronRight size={20} color="gray" />
       </View>
     </Pressable>
   );
 };