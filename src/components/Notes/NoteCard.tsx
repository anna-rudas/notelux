import React, { useContext } from "react";
import { className } from "../../helpers";
import * as style from "./Notes.module.css";
import * as shared from "../shared.module.css";
import { colors } from "../../constants";
import { AppContext } from "../../context";
import { Note } from "../../types";

type NoteCardProps = {
  note: Note;
};

function NoteCard({ note }: NoteCardProps) {
  const { handleEdit, isLoading } = useContext(AppContext);

  const { title, body, color } = note;
  return (
    <button
      disabled={isLoading}
      {...className(style.noteCard)}
      onClick={() => handleEdit(note)}
      style={{ backgroundColor: colors[color] }}
    >
      {title && <span {...className(style.noteTitle)}>{title}</span>}
      <span {...className(style.noteBody)}>{body}</span>
    </button>
  );
}

export default NoteCard;
