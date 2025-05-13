import axios from "./axios";

const signInWithEmailAndPassword = async (credential: {
  usernameOrEmail: string;
  password: string;
}) => {
  const response = await axios.post("/api/auth/mobile-login", credential);
  console.log(response);
  return response.data;
};

export const auth = {
  signInWithEmailAndPassword,
};
