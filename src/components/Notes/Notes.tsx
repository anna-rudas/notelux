import React, { useEffect, useState, useContext } from "react";
import { className, sortNotes } from "../../helpers";
import * as style from "./Notes.module.css";
import * as shared from "../shared.module.css";
import NoteCard from "./NoteCard";
import { AppContext } from "../../context";

function Notes() {
  const { notes, search, isGrid } = useContext(AppContext);

  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 600px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(max-width: 600px)")
      .addEventListener("change", (event) => setMatches(event.matches));

    return () => {
      window
        .matchMedia("(max-width: 600px)")
        .removeEventListener("change", (event) => setMatches(event.matches));
    };
  }, []);

  const numberOfColumns = !isGrid ? 1 : matches ? 2 : 4;

  const filteredNotes =
    notes &&
    notes.filter(function (current) {
      const searchRegex = new RegExp(search, "i");
      return searchRegex.test(current.title) || searchRegex.test(current.body);
    });

  const sortedNotes = sortNotes(filteredNotes, numberOfColumns);

  return (
    <div {...className(style.notesContainer)}>
      {filteredNotes.length > 0 ? (
        <div {...className(style.notesContent)}>
          {search !== "" && (
            <span {...className(shared.secondaryTitleText)}>
              Search results:
            </span>
          )}
          <div {...className(isGrid ? style.noteGridCon : style.noteListCon)}>
            {sortedNotes.map((currentColumn, index) => {
              return (
                <div key={index} {...className(style.column)}>
                  {currentColumn.map((currentNote) => {
                    return <NoteCard note={currentNote} key={currentNote.id} />;
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ) : search !== "" ? (
        <span {...className(shared.secondaryTitleText)}>
          No notes match your search
        </span>
      ) : (
        <span {...className(shared.secondaryTitleText)}>
          You have no notes saved
        </span>
      )}
    </div>
  );
}

export default Notes;
