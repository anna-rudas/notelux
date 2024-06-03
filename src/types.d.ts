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

type InfoMsg = {
  isError: boolean;
  desc: string;
  showMsg: boolean;
  isPersisting: boolean;
};

type ErrorCode =
  | "authinvalidemail"
  | "authinvalidcredential"
  | "authemailalreadyinuse"
  | "authweakpassword"
  | "authtoomanyrequests";
