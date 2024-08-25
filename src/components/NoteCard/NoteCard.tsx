import React, { useContext } from "react";
import { className, readyNoteTextPreview } from "../../utilities/helpers";
import { colors } from "../../data/constants";
import { AppContext } from "../../context/AppContext";
import { Note } from "../../types/types";
import * as style from "./NoteCard.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";
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
      {...className(style.noteCard)}
      onClick={() => handleOpenEditNoteModal(note)}
      style={user?.theme === "light" ? { backgroundColor: colors[color] } : {}}
    >
      {title && (
        <span {...className(style.noteTitle, textStyles.noteTitleText)}>
          {readyNoteTextPreview(title)}
        </span>
      )}
      <span {...className(style.noteBody, textStyles.noteBodyText)}>
        {readyNoteTextPreview(body)}
      </span>
    </button>
  );
}

export default NoteCard;
