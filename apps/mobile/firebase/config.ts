import { initializeApp, getApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDcNruTEq24vZEv0QBIK4MvYTvZMWtrcQI",
  authDomain: "reborn-mobile-app-b47f3.firebaseapp.com",
  databaseURL: "https://reborn-mobile-app-b47f3.firebaseio.com",
  projectId: "reborn-mobile-app-b47f3",
  storageBucket: "reborn-mobile-app-b47f3.appspot.com",
  messagingSenderId: " 1062355041038",
  appId: "1:1062355041038:ios:5aafc9187d353805e7755f",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { firebaseApp, auth, getApp, getAuth };
