import React, { useEffect, useState } from "react";
import { className, sortNotes } from "../../helpers";
import style from "./Notes.module.css";
import NoteCard from "./NoteCard";

function Notes({ notes, handleEdit, search, isGrid }) {
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 600px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(max-width: 600px)")
      .addEventListener("change", (event) => setMatches(event.matches));
  }, []);

  const numberOfColumns = !isGrid ? 1 : matches ? 2 : 4;

  const searchFilteredNotes = notes.filter(function (current) {
    return (
      current.title.toLowerCase().includes(search.toLowerCase()) ||
      current.body.toLowerCase().includes(search.toLowerCase())
    );
  });

  const sortedNotes = sortNotes(searchFilteredNotes, numberOfColumns);

  return (
    <div
      {...className(
        searchFilteredNotes.length > 0 ? style.notesCon : style.notesConEmpty
      )}
    >
      {searchFilteredNotes.length > 0 ? (
        <div {...className(isGrid ? style.noteGridCon : style.noteListCon)}>
          {sortedNotes.map((currentColumn, index) => {
            return (
              <div key={index} {...className(style.column)}>
                {currentColumn.map((currentNote) => {
                  return (
                    <NoteCard
                      {...currentNote}
                      key={currentNote.id}
                      handleEdit={handleEdit}
                    />
                  );
                })}
              </div>
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
