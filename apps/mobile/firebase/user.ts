import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, getDoc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { Result, User } from "~/types";

async function fetch(uid: string): Promise<Result<User | null>> {
  const firestore = getFirestore();

  try {
    const userDocRef = doc(firestore, "users", uid);
    const userDocument = await getDoc(userDocRef);
    if (!userDocument.exists()) {
      return { message: "User not found", success: false };
    }
    const user = userDocument.data();
    console.log("User data:", user);
    return {
      message: "User fetched successfully",
      success: true,
      data: user,
    };
  } catch (error: any) {
    console.error("Error fetching user:", error);

    return { message: "Failed to fetch user data", success: false };
  }
}

async function fetchCurrent(): Promise<Result<User | null>> {
  const uid = await AsyncStorage.getItem("uid");
  return uid ? fetch(uid) : { message: "UID is undefined", success: false };
}

async function update(
  uid: string,
  updatedData: Partial<User>
): Promise<Result> {
  const firestore = getFirestore();

  try {
    const userDocRef = doc(firestore, "users", uid);

    const userDocument = await getDoc(userDocRef);
    if (!userDocument.exists()) {
      return { message: "User not found", success: false };
    }

    await updateDoc(userDocRef, updatedData);
    console.log("User data updated successfully", updatedData);

    return { message: "User updated successfully", success: true };
  } catch (error: any) {
    console.error("Error updating user:", error);

    return { message: "Failed to update user data", success: false };
  }
}

async function updateCurrent(updatedData: Partial<User>): Promise<Result> {
  const uid = await AsyncStorage.getItem("uid");
  return uid
    ? update(uid, updatedData)
    : { message: "UID is undefined", success: false };
}

async function fetchAll(): Promise<Result<User[] | null>> {
  const firestore = getFirestore();

  try {
    const usersCollectionRef = collection(firestore, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);

    if (usersSnapshot.empty) {
      return { message: "No users found", success: false, data: null };
    }

    const users: User[] = usersSnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...(doc.data())
    })) as User[];

    console.log("Users data:", users);

    return {
      message: "Users fetched successfully",
      success: true,
      data: users,
    };
  } catch (error: any) {
    console.error("Error fetching users:", error);

    return { message: "Failed to fetch users", success: false, data: null };
  }
}


export const user = {
  fetch,
  fetchCurrent,
  fetchAll,
  update,
  updateCurrent,
};
