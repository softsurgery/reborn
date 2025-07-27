export interface SignInPayload {
  access_token: string;
  refresh_token: string;
}

export interface SignInDto {
  usernameOrEmail: string;
  password: string;
}
