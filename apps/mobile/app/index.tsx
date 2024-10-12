import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { KeyRound } from "lucide-react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuthManager } from "~/lib/stores/use-auth-form";
import { Label } from "~/components/ui/label";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection } from 'firebase/firestore';
import { firebaseApp } from "~/firebase/config";

const GITHUB_AVATAR_URI =
  "https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg";

export default function Screen() {
  const authManager = useAuthManager();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const onLoginPress = () => {
    setErrorMessage("");
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);

    signInWithEmailAndPassword(auth, authManager.email, authManager.password)
      .then(async (response) => {
        const uid = response.user.uid;

        // Get the users collection reference
        const usersRef = collection(firestore, 'users');
        const userDocRef = doc(usersRef, uid);

        // Get the document
        const firestoreDocument = await getDoc(userDocRef);
        if (!firestoreDocument.exists()) {
          alert('User does not exist anymore.');
          return;
        }

        const user = firestoreDocument.data();
        setIsAuthenticated(true); // Assuming setIsAuthenticated is a state setter
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };
  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <KeyboardAwareScrollView className="w-full">
        <Avatar alt="Reborn" className="self-center w-24 h-24">
          <AvatarImage source={{ uri: "../assets/images/adaptive-icon" }} />
          <AvatarFallback>
            <Text>RE</Text>
          </AvatarFallback>
        </Avatar>
        {errorMessage && (
          <Label className="text-lg font-normal mx-1 text-red-600">
            Error Message : {errorMessage}
          </Label>
        )}
        <View className="flex flex-col gap-5 px-2 mt-5">
          <Input
            placeholder="E-mail..."
            value={authManager.email}
            onChangeText={(text) => authManager.set("email", text)}
            aria-labelledby="inputLabel"
            aria-errormessage="inputError"
          />
          <Input
            secureTextEntry={true}
            placeholder="Password..."
            value={authManager.password}
            onChangeText={(text) => authManager.set("password", text)}
            aria-labelledby="inputLabel"
            aria-errormessage="inputError"
          />
          <Button className="flex flex-row" onPress={onLoginPress}>
            <IconWithTheme icon={KeyRound} size={18} />
            <Text className="text-lg font-normal mx-1">Access Account</Text>
          </Button>
        </View>
        <View className="flex items-center mt-20">
          <Label className="text-lg">Don't have an account?</Label>
          <Label className="font-bold">Sign up</Label>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
