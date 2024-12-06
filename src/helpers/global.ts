import { format, parseISO } from "date-fns";
import * as constants from "constants/constants";
import { UserInfo } from "interfaces/auth.model";

interface UserToken {
  token: string;
}

export function getUserToken(): UserToken | null {
  const token = localStorage.getItem(constants.KEY_ACCESS_TOKEN);
  return token ? (JSON.parse(token) as UserToken) : null;
}

/* LocalStorage Functions */

export const setLocalStorageItems = (data: UserInfo) => {
  let token = data.token;
  localStorage.setItem(constants.KEY_ACCESS_TOKEN, JSON.stringify({ token }));
};

export const clearLocalStorageItems = () => {
  localStorage.removeItem(constants.KEY_ACCESS_TOKEN);
  localStorage.removeItem(constants.KEY_USER_INFO);
};

export const dateFormmaterNoTime = (date: string) => {
  if (date !== undefined && date !== null && date !== "")
    return format(parseISO(date), "dd.MM.yyyy");
  else return null;
};
