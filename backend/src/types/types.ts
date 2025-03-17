import { colors } from "../data/constants";

type Color = keyof typeof colors;

export type Theme = "light" | "dark";

export type Layout = "grid" | "list";

export type NoteData = {
  title: string;
  body: string;
  color: Color;
  date: string;
  userId: string;
  coUsers: string[];
};

export type UserData = {
  email: string;
  theme: Theme;
  layout: Layout;
  username: string;
};
