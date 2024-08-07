import { Color, InfoMsg, Theme, Layout } from "./types";

export const colors = {
  default: "#FFFFFF",
  red: "#FAB2AB",
  yellow: "#FFDA44",
  green: "#CCFF90",
  blue: "#AECBFA",
  purple: "#E2C5FC",
  pink: "#FDCFE8",
  grey: "#E8EAED",
} as const;

export const colorInputs = Object.keys(colors) as Array<Color>;

export const notesColKey = "notes";

export const usersColKey = "users";

export const maxNoteCharToShow = 150;

export const defaultNoteColor: Record<Theme, Color> = {
  light: "yellow",
  dark: "default",
};

export const defaultTheme: Theme = "light";

export const defaultLayout: Layout = "grid";

export const defaultInfoMsg: InfoMsg = {
  isError: true,
  desc: "Unknown error, please try again later",
  showMsg: false,
  actionButtonText: "",
  isPersisting: false,
};

export const firebaseErrorCodes: Record<string, string> = {
  "auth/invalid-email": "not a valid email address",
  "auth/invalid-credential": "wrong email address or password",
  "auth/email-already-in-use": "this email address is already in use",
  "auth/weak-password": "password is too weak",
  "auth/too-many-requests": "too many requests",
  "auth/user-not-found": "no user with this email address",
  "auth/wrong-password": "wrong password",
};
