import React, { useContext } from "react";
import { className, readyNoteTextPreview } from "../../utilities/helpers";
import * as style from "./NoteCard.module.css";
import { colors } from "../../data/constants";
import { AppContext } from "../../context/AppContext";
import { Note } from "../../types/types";
import * as shared from "../../assets/styles/shared.module.css";
import { DashboardContext } from "../../context/DashboardContext";

type NoteCardProps = {
  note: Note;
};

function NoteCard({ note }: NoteCardProps) {
  const { isLoading, user } = useContext(AppContext);
  const { setIsEditing, setIsAddNoteOpen, setActiveNote } =
    useContext(DashboardContext);

  const handleOpenEditNoteModal = (note: Note) => {
    setIsEditing(true);
    setIsAddNoteOpen(false);
    setActiveNote(note);
  };

  const { title, body, color } = note;
  return (
    <button
      disabled={isLoading}
      {...className(style.noteCard, isLoading && shared.btnDisabled)}
      onClick={() => handleOpenEditNoteModal(note)}
      style={user?.theme === "light" ? { backgroundColor: colors[color] } : {}}
    >
      {title && (
        <span {...className(style.noteTitle, shared.noteTitleText)}>
          {readyNoteTextPreview(title)}
        </span>
      )}
      <span {...className(style.noteBody, shared.noteBodyText)}>
        {readyNoteTextPreview(body)}
      </span>
    </button>
  );
}

export default NoteCard;
