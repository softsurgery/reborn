import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import axios from "./axios";

const saveToken = (access_token: string, refresh_token: string) => {
  const authPersistStore = useAuthPersistStore.getState();
  authPersistStore.setAccessToken(access_token);
  authPersistStore.setRefreshToken(refresh_token);
  authPersistStore.setAuthenticated(true);
  console.log(authPersistStore);
};

const signInWithEmailAndPassword = async (credential: {
  usernameOrEmail: string;
  password: string;
}) => {
  const response = await axios.post("/auth/sign-in", credential);
  saveToken(response.data.access_token, response.data.refresh_token);
  return response.data;
};

// const signupWithEmailAndPassword = async (credential: {
//   usernameOrEmail: string;
//   password: string;
// }) {

// }

export const auth = {
  signInWithEmailAndPassword,
};
