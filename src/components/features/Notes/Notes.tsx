import React, { useEffect, useState, useContext } from "react";
import {
  className,
  filterNotesBySearch,
  sortNotesIntoColumns,
} from "../../../utilities/helpers";
import * as style from "./Notes.module.css";
import * as textStyles from "../../../assets/styles/text-styles.module.css";
import * as modals from "../../../assets/styles/modals.module.css";
import NoteCard from "../../templates/NoteCard";
import { AppContext } from "../../../context/AppContext";
import { DashboardContext } from "../../../context/DashboardContext";
import LoadingIcon from "../../../assets/icons/LoadingIcon";
import { Note } from "../../../types/types";

function Notes() {
  const { search, user } = useContext(AppContext);
  const { notes, areNotesLoading } = useContext(DashboardContext);

  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [sortedNotes, setSortedNotes] = useState<Note[][]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.matchMedia("(max-width: 600px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(max-width: 600px)")
      .addEventListener("change", (event) => setIsSmallScreen(event.matches));

    return () => {
      window
        .matchMedia("(max-width: 600px)")
        .removeEventListener("change", (event) =>
          setIsSmallScreen(event.matches)
        );
    };
  }, []);

  useEffect(() => {
    const numberOfColumns = (() => {
      if (user?.layout === "list") return 1;
      return isSmallScreen ? 2 : 4;
    })();

    const filteredNotesResult = filterNotesBySearch(notes, search);
    setFilteredNotes(filteredNotesResult);

    const sortedNotesResult = sortNotesIntoColumns(
      filteredNotesResult,
      numberOfColumns
    );
    setSortedNotes(sortedNotesResult);
  }, [notes, search, isSmallScreen]);

  if (areNotesLoading) {
    return (
      <div {...className(style.notesContainer)}>
        <LoadingIcon
          {...className(modals.loadingIcon, modals.loadingAnimation)}
        />
      </div>
    );
  }

  return (
    <div {...className(style.notesContainer)}>
      {filteredNotes.length > 0 ? (
        <div {...className(style.notesContent)}>
          {search !== "" && (
            <span {...className(textStyles.subtitleText)}>Search results:</span>
          )}
          <div
            {...className(
              user?.layout === "grid" ? style.noteGridCon : style.noteListCon
            )}
          >
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
        <span {...className(textStyles.subtitleText)}>
          No notes match your search
        </span>
      ) : (
        <span {...className(textStyles.subtitleText)}>
          You have no notes saved
        </span>
      )}
    </div>
  );
}

export default Notes;
