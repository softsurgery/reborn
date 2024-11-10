import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useNavigation } from "expo-router";
import { useAuthFunctions } from "~/hooks/useAuthFunctions";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Home,
  MessageCircleHeart,
  Plus,
  PlusCircle,
  ReceiptPoundSterling,
  User,
  Wallet,
} from "lucide-react-native";
import { IconWithTheme } from "~/lib/IconWithTheme";

export default function Screen() {
  const navigation = useNavigation();
  const { handleSignOut } = useAuthFunctions();
  const [value, setValue] = React.useState("a");

  return (
    <View className="flex-1 w-full py-5">
      <Tabs
        value={value}
        onValueChange={setValue}
        className="flex-1 w-full flex-col justify-between gap-1.5"
      >
        <View className="flex-grow">
          <TabsContent value="a">
            <Text className="p-10">A</Text>
            <Button onPress={handleSignOut} className="mx-10">
              <Text>Exit</Text>
            </Button>
          </TabsContent>
          <TabsContent value="b">
            <Text className="p-10">B</Text>
            <Button onPress={handleSignOut} className="mx-10">
              <Text>Exit</Text>
            </Button>
          </TabsContent>
          <TabsContent value="home">
            <Text className="p-10">Home</Text>
            <Button onPress={handleSignOut} className="mx-10">
              <Text>Exit</Text>
            </Button>
          </TabsContent>
          <TabsContent value="d">
            <Text className="p-10">D</Text>
            <Button onPress={handleSignOut} className="mx-10">
              <Text>Exit</Text>
            </Button>
          </TabsContent>
          <TabsContent value="e">
            <Text className="p-10">E</Text>
            <Button onPress={handleSignOut} className="mx-10">
              <Text>Exit</Text>
            </Button>
          </TabsContent>
        </View>

        <TabsList className="flex-row w-full">
          <TabsTrigger value="a" className="w-1/5">
            <IconWithTheme icon={User} size={32} />
          </TabsTrigger>
          <TabsTrigger value="b" className="w-1/5">
            <IconWithTheme icon={MessageCircleHeart} size={32} />
          </TabsTrigger>
          <Button
            variant="outline"
            className="w-20 h-20 -top-4 rounded-full aspect-square flex items-center justify-center border-4 mx-2"
          >
            <IconWithTheme icon={Plus} size={44} />
          </Button>

          <TabsTrigger value="d" className="w-1/5">
            <IconWithTheme icon={Wallet} size={32} />
          </TabsTrigger>
          <TabsTrigger value="home" className="w-1/5">
            <IconWithTheme icon={Home} size={32} />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </View>
  );
}
