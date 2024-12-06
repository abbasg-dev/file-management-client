import axios, { AxiosResponse } from "axios";
import { userCredentials, UserInfo, RegisterUser } from "interfaces/auth.model";

const apiURL = process.env.REACT_APP_REST_API_URL;

const api = axios.create({
  baseURL: apiURL,
  headers: {
    Pragma: "no-cache",
    "Cache-control": "no-cache",
  },
  timeout: 1000 * 5,
});

export const userLogin = async (data: userCredentials): Promise<UserInfo> => {
  const response = await api.post<UserInfo>(`/auth/login`, data);
  return response.data;
};

export const userRegister = async (
  data: RegisterUser
): Promise<AxiosResponse> => {
  const response = await api.post<AxiosResponse>(`/auth/register`, data);
  return response.data;
};
