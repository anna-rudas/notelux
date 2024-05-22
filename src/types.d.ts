type Note = {
  id: string;
  title: string;
  body: string;
  color: Color;
  date: Date;
};

type User = {
  id: string;
  userId: string;
  theme?: Theme;
  nickname?: string;
  name?: string;
};

type Theme = "light" | "dark";

type Color =
  | "default"
  | "yellow"
  | "red"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "grey";
