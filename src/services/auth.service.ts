import { type User } from "@/types/User.type";
import { axiosAPI } from "@/utils/axios";

export interface Auth {
  data: Data;
  message: string;
}

export interface Data {
  access_token: string;
  user: User;
}

export const loginService = (username: string, password: string) => {
  return axiosAPI.post<Auth>("/login", {
    username: username,
    password: password,
  });
};
