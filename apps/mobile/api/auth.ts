import axios from "./axios";

const signInWithEmailAndPassword = async (credential: {
  usernameOrEmail: string;
  password: string;
}) => {
  const response = await axios.post("/api/auth/sign-in", credential);
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
