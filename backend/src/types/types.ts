import { colors } from "../data/constants";

type Color = keyof typeof colors;

export type NoteData = {
  title: string;
  body: string;
  color: Color;
  date: string;
  userId: string;
  coUsers: string[];
};
