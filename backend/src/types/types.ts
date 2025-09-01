import { colors } from "../data/constants";

type Color = keyof typeof colors;

export type Theme = "light" | "dark";

export type Layout = "grid" | "list";

export type NoteData = {
  title: string;
  body: string;
  color: Color;
  date: string;
  user_id: string;
  co_users: string[];
};

export type UserData = {
  email: string;
  theme: Theme;
  layout: Layout;
  username: string;
  user_id: string;
};

export type UserDataGetEmail = {
  email: string;
};

export type UserDataGetUserId = {
  user_id: string;
};

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}
