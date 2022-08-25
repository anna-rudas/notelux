import React from "react";
import { className } from "../../helpers";
import style from "./Notes.module.css";
import shared from "../shared.module.css";

function NoteCard({ title, body }) {
  return (
    <div {...className(style.noteCard, shared.shadow)}>
      <span {...className(style.noteTitle)}>{title}</span>
      <span {...className(style.noteBody)}>{body}</span>
    </div>
  );
}

export default NoteCard;
