import React, { useContext } from "react";
import { className } from "../../utilities/helpers";
import * as style from "./Notes.module.css";
import { colors, maxNoteCharToShow } from "../../data/constants";
import { AppContext } from "../../context/context";
import { Note } from "../../types/types";
import * as shared from "../../assets/styles/shared.module.css";

type NoteCardProps = {
  note: Note;
};

function NoteCard({ note }: NoteCardProps) {
  const { handleEdit, isLoading, user } = useContext(AppContext);

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
      {...className(style.noteCard, isLoading ? shared.btnDisabled : "")}
      onClick={() => handleEdit(note)}
      style={user?.theme === "light" ? { backgroundColor: colors[color] } : {}}
    >
      {title && (
        <span {...className(style.noteTitle, shared.noteTitleText)}>
          {readyText(title)}
        </span>
      )}
      <span {...className(style.noteBody, shared.noteBodyText)}>
        {readyText(body)}
      </span>
    </button>
  );
}

export default NoteCard;
