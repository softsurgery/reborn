import { initializeApp, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  inMemoryPersistence
  
} from "@firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDcNruTEq24vZEv0QBIK4MvYTvZMWtrcQI",
  authDomain: "reborn-mobile-app-b47f3.firebaseapp.com",
  databaseURL: "https://reborn-mobile-app-b47f3-default-rtdb.firebaseio.com",
  projectId: "reborn-mobile-app-b47f3",
  storageBucket: "reborn-mobile-app-b47f3.appspot.com",
  messagingSenderId: "1062355041038",
  appId: "1:1062355041038:ios:5aafc9187d353805e7755f",
};

const persistence =
  Platform.OS === "web"
    ? inMemoryPersistence
    : getReactNativePersistence(ReactNativeAsyncStorage);

const firebaseApp = initializeApp(firebaseConfig);
const auth = initializeAuth(firebaseApp, {
  persistence
});

export { firebaseApp, auth, getApp, getAuth };
