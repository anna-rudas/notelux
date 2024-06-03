import { firebaseErrorCodes, errorCodeInputs } from "./constants";

export const className = (...classNames: string[]) => {
  return {
    className: classNames.filter(Boolean).join(" "),
  };
};

export const sortNotes: (
  notes: Array<Note>,
  numberOfColumns: number
) => Array<Array<Note>> = (notes, numberOfColumns) => {
  const columns: Array<Array<Note>> = [];
  for (let i = 0; i < numberOfColumns; i++) {
    columns.push([]);
  }

  notes.sort((a, b) => a.title.length - b.title.length);

  for (let i = 0; i < notes.length; i = i + numberOfColumns) {
    for (let j = 0; j < numberOfColumns; j++) {
      if (notes[i + j]) {
        columns[j].push(notes[i + j]);
      }
    }
  }

  columns.forEach((current) => {
    current.sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
    );
  });

  return columns;
};

export const evalErrorCode = (code: string): string => {
  const simplified = code.split("/").join("").split("-").join("");
  const result: string[] = [];
  errorCodeInputs.map((currCode) => {
    if (currCode == simplified) {
      result.push(firebaseErrorCodes[currCode]);
    }
  });
  if (result.length == 0) {
    return "unknown error";
  }
  return result[0];
};
