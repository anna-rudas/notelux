import React, { useState, useContext, FormEvent } from "react";
import { className } from "../../helpers";
import PaletteIcon from "../../icons/PaletteIcon";
import ColorPalette from "../ColorPalette";
import { colors } from "../../constants";
import * as style from "./Form.module.css";
import * as shared from "../shared.module.css";
import { AppContext } from "../../context";
import { Note } from "../../types";
import MoreOptionsIcon from "../../icons/MoreOptionsIcon";
import MoreNoteOptions from "../MoreNoteOptions";

type FormProps = {
  handleSubmit: () => void;
  handleCancel: () => void;
  setIsDelConfOpen?: (value: boolean) => void;
  setIsShareNoteOpen?: (value: boolean) => void;
  noteFormStyle: string;
  noteBodyStyle: string;
};

function Form({
  handleSubmit,
  handleCancel,
  setIsDelConfOpen,
  setIsShareNoteOpen,
  noteFormStyle,
  noteBodyStyle,
}: FormProps) {
  const {
    activeNote,
    isEditing,
    setActiveNoteValue,
    isLoading,
    user,
    isMoreNoteOptionsOpen,
    setIsMoreNoteOptionsOpen,
    moreNoteOptionsButtonRef,
  } = useContext(AppContext);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit();
  };

  return (
    <form
      {...className(noteFormStyle, style.noteForm, shared.shadow)}
      onSubmit={handleSubmitForm}
      style={
        user?.theme === "light"
          ? { backgroundColor: colors[(activeNote as Note).color] }
          : { border: `1.5px solid var(--text-secondary)` }
      }
    >
      <input
        {...className(style.noteTitle)}
        maxLength={1000}
        type="text"
        placeholder="Title"
        value={(activeNote as Note).title}
        onChange={(event) => setActiveNoteValue("title", event.target.value)}
        autoFocus
      />
      <textarea
        {...className(noteBodyStyle, style.noteBody)}
        placeholder="Take a note"
        maxLength={20000}
        value={(activeNote as Note).body}
        onChange={(event) => setActiveNoteValue("body", event.target.value)}
      ></textarea>
      <div {...className(style.noteSet)}>
        <div {...className(style.btnsCon)}>
          {isEditing && (
            <>
              <button
                ref={moreNoteOptionsButtonRef}
                onClick={() => {
                  setIsMoreNoteOptionsOpen(!isMoreNoteOptionsOpen);
                }}
                disabled={isLoading}
                {...className(style.btnIcon)}
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
              {...className(style.btnIcon)}
              type="button"
              onClick={() => {
                setIsPaletteOpen(!isPaletteOpen);
              }}
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
            {...className(shared.btn, style.buttonNotePrimary)}
            style={
              user?.theme === "light"
                ? { color: colors[(activeNote as Note).color] }
                : {}
            }
            type="submit"
          >
            Save
          </button>
          <button
            disabled={isLoading}
            {...className(shared.btn, style.buttonNoteSecondary)}
            style={
              user?.theme === "light"
                ? { backgroundColor: colors[(activeNote as Note).color] }
                : { backgroundColor: "var(--bg)" }
            }
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
        {isMoreNoteOptionsOpen && (
          <MoreNoteOptions
            setIsDelConfOpen={setIsDelConfOpen}
            setIsShareNoteOpen={setIsShareNoteOpen}
            backgroundColor={colors[(activeNote as Note).color]}
          />
        )}
      </div>
    </form>
  );
}

export default Form;
