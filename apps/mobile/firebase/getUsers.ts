import { collection, getDocs, getFirestore } from "firebase/firestore";
import { User } from "~/types";

const firestore = getFirestore();

export const getUsers = async (): Promise<User[]> => {
  const usersCollection = collection(firestore, "users");
  const snapshot = await getDocs(usersCollection);

  return snapshot.docs.map((doc) => {
    const data = doc.data(); 
    return {
      id: doc.id, 
      surname: data.surname || "No name available",
      email: data.email || "No email available",
      phone: data.phone || "No phone available",
      bio: data.bio || "No bio available",
      ...data,  
    } as User;
  });
};
