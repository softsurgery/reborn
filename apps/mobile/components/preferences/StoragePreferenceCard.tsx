import React from "react";
 import { Text } from "~/components/ui/text";
 import { View } from "react-native";
 import { Switch } from "~/components/ui/switch";
 import { Label } from "~/components/ui/label";
 import { Button } from "~/components/ui/button";
 import { cn } from "~/lib/utils";
 import { Trash2 } from "lucide-react-native";
 
 interface StoragePreferenceCardProps {
   autoDownload: boolean;
   onToggleAutoDownload: () => void;
   onClearCache: () => void;
   className?: string;
 }
 
 export const StoragePreferenceCard = ({
   autoDownload,
   onToggleAutoDownload,
   onClearCache,
   className,
 }: StoragePreferenceCardProps) => {
   return (
     <View className={cn("flex-col gap-4", className)}>
       <View className="flex-row items-center justify-between">
         <View className="flex flex-col items-start">
           <Label className="text-lg">Auto-Download Media</Label>
           <Text className="text-sm text-gray-400 dark:text-gray-500">
             Automatically download media over WiFi
           </Text>
         </View>
         <Switch checked={autoDownload} onCheckedChange={onToggleAutoDownload} />
       </View>
 
       <View className="flex-row items-center justify-between">
         <View className="flex flex-col items-start">
           <Label className="text-lg">Clear Cache</Label>
           <Text className="text-sm text-gray-400 dark:text-gray-500">
             Free up storage by clearing cached data
           </Text>
         </View>
         <Button variant="outline" onPress={onClearCache}>
           <Trash2 size={16} className="mr-2" />
           <Text>Clear</Text>
         </Button>
       </View>
     </View>
   );
 };