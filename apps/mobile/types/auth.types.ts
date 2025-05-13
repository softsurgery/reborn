export interface SignInPayload {
  accessToken: string;
  refreshToken: string;
}

export interface SignInDto {
  usernameOrEmail: string;
  password: string;
}
