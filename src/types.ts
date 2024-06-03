import { colors } from "./constants";

export type Note = {
  id: string;
  title: string;
  body: string;
  color: Color;
  date: Date;
  userId: string;
};

export type User = {
  id: string;
  email: string;
  theme?: Theme;
  username: string;
};

export type Theme = "light" | "dark";

export type InfoMsg = {
  isError: boolean;
  desc: string;
  showMsg: boolean;
  isPersisting: boolean;
};

export type ErrorCode =
  | "authinvalidemail"
  | "authinvalidcredential"
  | "authemailalreadyinuse"
  | "authweakpassword"
  | "authtoomanyrequests";

export type Color = keyof typeof colors;
