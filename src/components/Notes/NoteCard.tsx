import React from "react";
import { className } from "../../helpers";
import * as style from "./Notes.module.css";
import * as shared from "../shared.module.css";
import { colors } from "../../constants";

type NoteCardProps = {
  note: Note;
  handleEdit: (id: string) => void;
};

function NoteCard({ note, handleEdit }: NoteCardProps) {
  const { title, body, color, id } = note;
  return (
    <button
      {...className(style.noteCard, shared.shadow)}
      onClick={() => handleEdit(id)}
      style={{ backgroundColor: colors[color] }}
    >
      {title && <span {...className(style.noteTitle)}>{title}</span>}
      <span {...className(style.noteBody)}>{body}</span>
    </button>
  );
}

export default NoteCard;
