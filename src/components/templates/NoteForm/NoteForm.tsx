import React, { useState, useContext, FormEvent } from "react";
import { className } from "../../../utilities/helpers";
import PaletteIcon from "../../../assets/icons/PaletteIcon";
import ColorPalette from "../../features/ColorPalette";
import { colors } from "../../../data/constants";
import * as style from "./NoteForm.module.css";
import * as shared from "../../../assets/styles/shared.module.css";
import * as textStyles from "../../../assets/styles/text-styles.module.css";
import { AppContext } from "../../../context/AppContext";
import MoreOptionsIcon from "../../../assets/icons/MoreOptionsIcon";
import MoreNoteOptions from "../../features/MoreNoteOptions";
import { DashboardContext } from "../../../context/DashboardContext";
import PrimaryButton from "../../buttons/PrimaryButton";
import SecondaryButton from "../../buttons/SecondaryButton";
import FocusTrap from "focus-trap-react";

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
    <FocusTrap
      focusTrapOptions={{
        allowOutsideClick: true,
        onDeactivate: () => {
          handleCancel();
        },
      }}
    >
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
          {...className(style.noteTitle, textStyles.subtitleText)}
          maxLength={1000}
          type="text"
          placeholder="Title"
          value={activeNote.title}
          onChange={(event) => setActiveNoteValue("title", event.target.value)}
          autoFocus
        />
        <textarea
          {...className(noteBodyStyle, style.noteBody, textStyles.noteBodyText)}
          placeholder="Take a note"
          maxLength={20000}
          value={activeNote.body}
          onChange={(event) => setActiveNoteValue("body", event.target.value)}
        ></textarea>
        <div {...className(style.noteSet)}>
          <div {...className(style.btnsCon)}>
            <div {...className(style.paletteCon)}>
              <button
                disabled={isLoading}
                {...className(style.btnIcon)}
                type="button"
                onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                title="Colors"
              >
                <PaletteIcon {...className(style.paletteIcon)} />
              </button>

              {isPaletteOpen && <ColorPalette />}
            </div>
            {isEditing && (
              <>
                <button
                  ref={moreNoteOptionsButtonRef}
                  onClick={() =>
                    setIsMoreNoteOptionsOpen(!isMoreNoteOptionsOpen)
                  }
                  disabled={isLoading}
                  {...className(style.btnIcon)}
                  type="button"
                  title="More options"
                >
                  <MoreOptionsIcon {...className(style.moreOptionsIcon)} />
                </button>
              </>
            )}
          </div>
          <div {...className(style.btnsCon)}>
            <PrimaryButton handleClick={handleSubmit} buttonText="Save" />
            <SecondaryButton handleClick={handleCancel} buttonText="Cancel" />
          </div>
          {isMoreNoteOptionsOpen && (
            <MoreNoteOptions backgroundColor={colors[activeNote.color]} />
          )}
        </div>
      </form>
    </FocusTrap>
  );
}

export default NoteForm;
