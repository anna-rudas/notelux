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
import { useMediaQuery } from "usehooks-ts";

function Notes() {
  const { termToSearch, user } = useContext(AppContext);
  const { notes, areNotesLoading } = useContext(DashboardContext);

  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [sortedNotes, setSortedNotes] = useState<Note[][]>([]);

  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    const numberOfColumns = (() => {
      if (user?.layout === "list") return 1;
      return isSmallScreen ? 2 : 4;
    })();

    const filteredNotesResult = filterNotesBySearch(notes, termToSearch);
    setFilteredNotes(filteredNotesResult);

    const sortedNotesResult = sortNotesIntoColumns(
      filteredNotesResult,
      numberOfColumns
    );
    setSortedNotes(sortedNotesResult);
  }, [notes, termToSearch, isSmallScreen, user]);

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
          {termToSearch !== "" && (
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
      ) : termToSearch !== "" ? (
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
