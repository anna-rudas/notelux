type Note = {
  title: string;
  body: string;
  color: Color;
  id: string;
  date: Date;
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
