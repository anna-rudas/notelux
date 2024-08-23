import React, { useState, useContext, FormEvent } from "react";
import { className } from "../../utilities/helpers";
import PaletteIcon from "../../assets/icons/PaletteIcon";
import ColorPalette from "../ColorPalette";
import { colors } from "../../data/constants";
import * as style from "./NoteForm.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import { AppContext } from "../../context/AppContext";
import MoreOptionsIcon from "../../assets/icons/MoreOptionsIcon";
import MoreNoteOptions from "../MoreNoteOptions";
import { DashboardContext } from "../../context/DashboardContext";

type NoteFormProps = {
  handleSubmit: () => void;
  handleCancel: () => void;
  noteFormStyle: string;
  noteBodyStyle: string;
};

function NoteForm({
  handleSubmit,
  handleCancel,
  noteFormStyle,
  noteBodyStyle,
}: NoteFormProps) {
  const { isLoading, user } = useContext(AppContext);

  const {
    setActiveNoteValue,
    activeNote,
    isEditing,
    isMoreNoteOptionsOpen,
    setIsMoreNoteOptionsOpen,
    moreNoteOptionsButtonRef,
  } = useContext(DashboardContext);

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit();
  };

  if (activeNote === null) {
    return null;
  }

  return (
    <form
      {...className(noteFormStyle, style.noteForm, shared.shadow)}
      onSubmit={handleSubmitForm}
      style={
        user?.theme === "light"
          ? { backgroundColor: colors[activeNote.color] }
          : { border: `2px solid var(--text-secondary)` }
      }
    >
      <input
        {...className(style.noteTitle)}
        maxLength={1000}
        type="text"
        placeholder="Title"
        value={activeNote.title}
        onChange={(event) => setActiveNoteValue("title", event.target.value)}
        autoFocus
      />
      <textarea
        {...className(noteBodyStyle, style.noteBody)}
        placeholder="Take a note"
        maxLength={20000}
        value={activeNote.body}
        onChange={(event) => setActiveNoteValue("body", event.target.value)}
      ></textarea>
      <div {...className(style.noteSet)}>
        <div {...className(style.btnsCon)}>
          {isEditing && (
            <>
              <button
                ref={moreNoteOptionsButtonRef}
                onClick={() => setIsMoreNoteOptionsOpen(!isMoreNoteOptionsOpen)}
                disabled={isLoading}
                {...className(style.btnIcon, isLoading && shared.btnDisabled)}
                type="button"
                title="More options"
              >
                <MoreOptionsIcon {...className(style.moreOptionsIcon)} />
              </button>
            </>
          )}
          <div {...className(style.paletteCon)}>
            <button
              disabled={isLoading}
              {...className(style.btnIcon, isLoading && shared.btnDisabled)}
              type="button"
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              title="Colors"
            >
              <PaletteIcon {...className(style.paletteIcon)} />
            </button>

            {isPaletteOpen && <ColorPalette />}
          </div>
        </div>
        <div {...className(style.btnsCon)}>
          <button
            disabled={isLoading}
            {...className(
              shared.btn,
              style.buttonNotePrimary,
              isLoading && shared.btnDisabled
            )}
            style={
              user?.theme === "light" ? { color: colors[activeNote.color] } : {}
            }
            type="submit"
          >
            Save
          </button>
          <button
            disabled={isLoading}
            {...className(
              shared.btn,
              style.buttonNoteSecondary,
              isLoading ? shared.btnDisabled : ""
            )}
            style={
              user?.theme === "light"
                ? { backgroundColor: colors[activeNote.color] }
                : { backgroundColor: "var(--bg)" }
            }
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
        {isMoreNoteOptionsOpen && (
          <MoreNoteOptions backgroundColor={colors[activeNote.color]} />
        )}
      </div>
    </form>
  );
}

export default NoteForm;
