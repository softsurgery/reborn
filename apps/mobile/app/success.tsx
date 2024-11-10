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
          <TabsContent value="c">
            <Text className="p-10">C</Text>
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
            <Text>A</Text>
          </TabsTrigger>
          <TabsTrigger value="b" className="w-1/5">
            <Text>B</Text>
          </TabsTrigger>
          <TabsTrigger value="c" className="w-1/5">
            <Text>C</Text>
          </TabsTrigger>
          <TabsTrigger value="d" className="w-1/5">
            <Text>D</Text>
          </TabsTrigger>
          <TabsTrigger value="e" className="w-1/5">
            <Text>E</Text>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </View>
  );
}
