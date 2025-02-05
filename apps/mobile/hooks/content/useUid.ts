import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useUserUid() {
  const [uid, setUid] = useState<string | undefined>(undefined);
  const [isUidPending, setIsUidPending] = useState(true);

  useEffect(() => {
    async function fetchUid() {
      const storedUid = await AsyncStorage.getItem("uid");
      setUid(storedUid || undefined);
      setIsUidPending(false);
    }

    fetchUid();
  }, []);

  return { uid, isUidPending };
}
