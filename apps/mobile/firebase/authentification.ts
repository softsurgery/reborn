import { firebaseApp } from "./config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { Credentials, Result } from "~/types";

export async function SignInWithEmail({
  email,
  password,
}: Credentials): Promise<Result> {
 
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    const uid = response.user.uid;

    const usersRef = collection(firestore, "users");
    const userDocRef = doc(usersRef, uid);

    const firestoreDocument = await getDoc(userDocRef);

    const user = firestoreDocument.data();
    return { message: "LOGIN_SUCCESSFUL", success: true };
  } catch (error: any) {
    console.log(error);

    if (error.code === "auth/invalid-email") {
      return { message: "Invalid E-mail", success: false };
    }
    if (error.code === "auth/invalid-credential") {
      return { message: "Invalid Credential", success: false };
    }
    if (error.code === "auth/too-many-requests") {
      return { message: "Too Many Requests", success: false };
    }
    return {
      message: "INTERNAL_SERVER_ERROR",
      success: false,
    };
  }
}

export async function SignUnWithEmail({
  email,
  password,
}: Credentials): Promise<Result> {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return createUserWithEmailAndPassword(auth, email, password)
    .then(async (response) => {
      const uid = response.user.uid;

      const userDocRef = doc(firestore, "users", uid);

      await setDoc(userDocRef, {
        email: email,
        createdAt: new Date(),
      });
      return { message: "Signup successful!" };
    })
    .catch((error) => {
      return { message: error.message };
    });
}
