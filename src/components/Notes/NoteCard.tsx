import React, { useContext } from "react";
import { className } from "../../helpers";
import * as style from "./Notes.module.css";
import * as shared from "../shared.module.css";
import { colors } from "../../constants";
import { AppContext } from "../../context";

type NoteCardProps = {
  note: Note;
};

function NoteCard({ note }: NoteCardProps) {
  const { handleEdit } = useContext(AppContext);

  const { title, body, color } = note;
  return (
    <button
      {...className(style.noteCard, shared.shadow)}
      onClick={() => handleEdit(note)}
      style={{ backgroundColor: colors[color] }}
    >
      {title && <span {...className(style.noteTitle)}>{title}</span>}
      <span {...className(style.noteBody)}>{body}</span>
    </button>
  );
}

export default NoteCard;
