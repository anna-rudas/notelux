import { firebaseErrorCodes, maxNoteCharToShow } from "../data/constants";
import { Note } from "../types/types";

export const className = (...classNames: string[]) => {
  return {
    className: classNames.filter(Boolean).join(" "),
  };
};

export const filterNotesBySearch = (notes: Note[], searchTerm: string) => {
  const searchRegex = new RegExp(searchTerm, "i");

  return notes.filter(function (current) {
    return searchRegex.test(current.title) || searchRegex.test(current.body);
  });
};

export const sortNotesIntoColumns: (
  notes: Array<Note>,
  numberOfColumns: number
) => Array<Array<Note>> = (notes, numberOfColumns) => {
  const columns: Array<Array<Note>> = [];
  for (let i = 0; i < numberOfColumns; i++) {
    columns.push([]);
  }

  notes.sort((a, b) => a.title.length - b.title.length);

  // distribute note length evenly across columns
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
  return firebaseErrorCodes[code] ?? "unknown error";
};

export const readyNoteTextPreview = (text: string) => {
  if (text.length > maxNoteCharToShow) {
    const shortenedText = text.substring(0, maxNoteCharToShow);
    const textWithEllipses = shortenedText.concat("...");
    return textWithEllipses;
  }
  return text;
};
