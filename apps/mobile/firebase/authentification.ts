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
import { isEmail } from "~/lib/validators/isEmail";
import { Credentials, Result } from "~/types";
import { User } from "~/types/User";

export function VerifyEmailAndPassword(email: string, password: string) {
  const errors = [];
  if (!isEmail(email))
    errors.push({ field: "emailError", message: "Please enter a valid email" });
  if (password.length < 6)
    errors.push({
      field: "passwordError",
      message: "Please enter a valid password",
    });
  return errors;
}

export function VerifySignUpWithEmailAndPassword(
  name: string,
  surname: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  const errors = VerifyEmailAndPassword(email, password);

  if (name.length < 3)
    errors.push({
      field: "nameError",
      message: "Please enter a valid name with at least 3 letters",
    });
  if (surname.length < 3)
    errors.push({
      field: "surnameError",
      message: "Please enter a valid surname with at least 3 letters",
    });
  if (password !== confirmPassword)
    errors.push({
      field: "confirmPasswordError",
      message: "Passwords do not match",
    });
  return errors;
}

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

export async function SignUpWithEmail(
  { name, surname }: User,
  { email, password }: Credentials
): Promise<Result> {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return createUserWithEmailAndPassword(auth, email, password)
    .then(async (response) => {
      const uid = response.user.uid;

      const userDocRef = doc(firestore, "users", uid);

      await setDoc(userDocRef, {
        name,
        surname,
        email: email,
        createdAt: new Date(),
      });
      return { message: "Signup successful!" };
    })
    .catch((error) => {
      return { message: error.message };
    });
}
