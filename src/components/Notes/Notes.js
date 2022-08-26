import React from "react";
import { className } from "../../helpers";
import style from "./Notes.module.css";
import NoteCard from "./NoteCard";
//import shared from "../shared.module.css";

function Notes({ notes, handleEdit, search }) {
  const searchFilteredNotes = notes.filter(function (current) {
    return (
      current.title.toLowerCase().includes(search.toLowerCase()) ||
      current.body.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div
      {...className(
        searchFilteredNotes.length > 0 ? style.notesCon : style.notesConEmpty
      )}
    >
      {searchFilteredNotes.length > 0 ? (
        <div {...className(style.noteListCon)}>
          {searchFilteredNotes.map((currentNote) => {
            return (
              <NoteCard
                {...currentNote}
                key={currentNote.id}
                handleEdit={handleEdit}
              />
            );
          })}
        </div>
      ) : search !== "" ? (
        <span>No notes match your search</span>
      ) : (
        <span>You have no notes saved</span>
      )}
    </div>
  );
}

export default Notes;
