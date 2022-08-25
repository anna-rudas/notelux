import React from "react";
import { className } from "../../helpers";
import style from "./Notes.module.css";
import shared from "../shared.module.css";

function NoteCard({ title, body, id, handleEdit }) {
  return (
    <button
      {...className(style.noteCard, shared.shadow)}
      onClick={(event) => handleEdit(event, id)}
    >
      <span {...className(style.noteTitle)}>{title}</span>
      <span {...className(style.noteBody)}>{body}</span>
    </button>
  );
}

export default NoteCard;
