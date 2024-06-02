type Note = {
  id: string;
  title: string;
  body: string;
  color: Color;
  date: Date;
  userId: string;
};

type User = {
  id: string;
  email: string;
  theme?: Theme;
  username: string;
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
