import { ResponseUserDto } from "./user-management";

export interface ResponseSigninDto {
  access_token: string;
  refresh_token: string;
}

export interface RequestSignInDto {
  usernameOrEmail: string;
  password: string;
}

export interface RequestSignUpDto {
  email: string;
  username: string;
  password: string;
}

export interface ResponseSignupDto {
  user: ResponseUserDto;
}
