import React from "react";
import { className } from "../../helpers";
import style from "./Notes.module.css";
import NoteCard from "./NoteCard";
//import shared from "../shared.module.css";

function Notes({ notes, handleEdit }) {
  return (
    <div {...className(!notes.length ? style.notesConEmpty : style.notesCon)}>
      {!notes.length ? (
        <span>You have no notes saved</span>
      ) : (
        <div {...className(style.noteListCon)}>
          {notes.map((currentNote) => {
            return (
              <NoteCard
                {...currentNote}
                key={currentNote.id}
                handleEdit={handleEdit}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notes;
