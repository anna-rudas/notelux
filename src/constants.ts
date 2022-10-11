export const colors: Record<Color, string> = {
  default: "#FFFFFF",
  red: "#FAB2AB",
  yellow: "#FFDA44",
  green: "#CCFF90",
  blue: "#AECBFA",
  purple: "#E2C5FC",
  pink: "#FDCFE8",
  grey: "#E8EAED",
};

export const colorInputs = Object.keys(colors) as Array<Color>;

export const emptyNote: Note = {
  title: "",
  body: "",
  color: "default",
  id: "",
  date: new Date(),
};

export const notesKey = "savedNotes";

export const themeKey = "savedTheme";

export const defaultNoteColor: Record<Theme, Color> = {
  light: "default",
  dark: "yellow",
};
