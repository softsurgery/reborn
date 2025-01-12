import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { Result } from "~/types";
import { User } from "~/types/User";

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

async function update(uid: string, updatedData: Partial<User>) {
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

export const user = {
  fetch,
  update,
};
