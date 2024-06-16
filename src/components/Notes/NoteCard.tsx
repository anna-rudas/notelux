import React, { useContext } from "react";
import { className } from "../../helpers";
import * as style from "./Notes.module.css";
import { colors, maxNoteCharToShow } from "../../constants";
import { AppContext } from "../../context";
import { Note } from "../../types";

type NoteCardProps = {
  note: Note;
};

function NoteCard({ note }: NoteCardProps) {
  const { handleEdit, isLoading } = useContext(AppContext);

  const readyText = (text: string) => {
    if (text.length > maxNoteCharToShow) {
      const shortenedText = text.substring(0, maxNoteCharToShow);
      const textWithEllipses = shortenedText.concat("...");
      return textWithEllipses;
    }
    return text;
  };

  const { title, body, color } = note;
  return (
    <button
      disabled={isLoading}
      {...className(style.noteCard)}
      onClick={() => handleEdit(note)}
      style={{ backgroundColor: colors[color] }}
    >
      {title && <span {...className(style.noteTitle)}>{readyText(title)}</span>}
      <span {...className(style.noteBody)}>{readyText(body)}</span>
    </button>
  );
}

export default NoteCard;
