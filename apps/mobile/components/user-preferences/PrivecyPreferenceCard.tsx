import React from "react";
 import { Text } from "~/components/ui/text";
 import { View } from "react-native";
 import { Label } from "~/components/ui/label";
 import { cn } from "~/lib/utils";
 import { ChevronRight } from "lucide-react-native";
 import { IconWithTheme } from "~/lib/IconWithTheme";
 
 interface PrivacyPreferenceCardProps {
   title?: string;
   subtitle?: string;
   className?: string;
 }
 
 export const PrivacyPreferenceCard = ({
   title = "Privacy Settings",
   subtitle = "Manage your privacy preferences",
   className,
 }: PrivacyPreferenceCardProps) => {
   return (
     <View className={cn("flex-row items-center justify-between gap-2", className)}>
       <View className="flex flex-col items-start">
         <Label className="text-lg">{title}</Label>
         <Text className="text-sm text-gray-400 dark:text-gray-500">
           {subtitle}
         </Text>
       </View>
       <IconWithTheme icon={ChevronRight} size={20} color="gray" />
     </View>
   );
 };