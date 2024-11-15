import { doc, getDoc, getFirestore } from "firebase/firestore";

async function fetch(uid: string){
    const firestore = getFirestore();

    try {
      const userDocRef = doc(firestore, "users", uid);
  
      const userDocument = await getDoc(userDocRef);
  
      if (!userDocument.exists()) {
        return { message: "User not found", success: false };
      }
  
      const userData = userDocument.data();
  
      return { message: "User fetched successfully", success: true, data: userData };
    } catch (error: any) {
      console.error("Error fetching user:", error);
  
      return { message: "Failed to fetch user data", success: false };
    }
};

export const user  = {
    fetch
}
