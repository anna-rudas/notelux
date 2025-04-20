import { colors } from "../data/constants";

export type Note = {
  id: string;
  title: string;
  body: string;
  color: Color;
  date: string;
  userId: string;
  coUsers: string[];
};

export type NoteData = {
  title: string;
  body: string;
  color: Color;
  date: string;
  user_id: string;
  co_users: string[];
};

export type User = {
  userId: string;
  email: string;
  theme: Theme;
  layout: Layout;
  username: string;
};

export type AuthUser = {
  id: string;
  isAnonymous: boolean;
};

export type Theme = "light" | "dark";

export type Layout = "grid" | "list";

export type ToastMessage = {
  isError: boolean;
  description: string;
  showMessage: boolean;
  actionButtonText: string;
  isPersisting: boolean;
};

export type ErrorCode =
  | "authinvalidemail"
  | "authinvalidcredential"
  | "authemailalreadyinuse"
  | "authweakpassword"
  | "authtoomanyrequests";

export type Color = keyof typeof colors;
