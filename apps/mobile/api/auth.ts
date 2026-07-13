import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import axios from "./axios";
import {
  RequestClientOAuthDto,
  RequestClientSignInDto,
  RequestClientSignUpDto,
  ResponseClientSigninDto,
} from "~/types/auth";

const saveToken = (access_token: string, refresh_token: string) => {
  const authPersistStore = useAuthPersistStore.getState();
  authPersistStore.setAccessToken(access_token);
  authPersistStore.setRefreshToken(refresh_token);
  authPersistStore.setAuthenticated(true);
};

const signIn = async (
  requestClientSignInDto: RequestClientSignInDto,
): Promise<ResponseClientSigninDto> => {
  const response = await axios.post(
    "/client-auth/sign-in",
    requestClientSignInDto,
  );
  saveToken(response.data.access_token, response.data.refresh_token);
  return response.data;
};

const ssoSignIn = async (
  request: RequestClientOAuthDto,
): Promise<ResponseClientSigninDto> => {
  const response = await axios.post("/client-auth/oauth", request);
  saveToken(response.data.access_token, response.data.refresh_token);
  return response.data;
};

const signUp = async (requestClientSignUpDto: RequestClientSignUpDto) => {
  const response = await axios.post(
    "/client-auth/sign-up",
    requestClientSignUpDto,
  );
  return response.data;
};

const sendVerifyEmail = async (email?: string) => {
  const response = await axios.post("/client-auth/send-verify-email", {
    email,
  });
  return response.data;
};

export const auth = {
  signIn,
  ssoSignIn,
  signUp,
  sendVerifyEmail,
};
