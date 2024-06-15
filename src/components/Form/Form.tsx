import React, { useState, useContext, FormEvent } from "react";
import { className } from "../../helpers";
import TrashIcon from "../../icons/TrashIcon";
import PaletteIcon from "../../icons/PaletteIcon";
import ColorPalette from "../ColorPalette";
import { colors } from "../../constants";
import * as style from "./Form.module.css";
import * as shared from "../shared.module.css";
import { AppContext } from "../../context";
import { Note } from "../../types";
import ShareIcon from "../../icons/ShareIcon";

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
  const { activeNote, isEditing, setActiveNoteValue, isLoading } =
    useContext(AppContext);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit();
  };

  return (
    <form
      {...className(noteFormStyle, style.noteForm, shared.shadow)}
      onSubmit={handleSubmitForm}
      style={{ backgroundColor: colors[(activeNote as Note).color] }}
    >
      <input
        {...className(style.noteTitle)}
        maxLength={200}
        type="text"
        placeholder="Title"
        value={(activeNote as Note).title}
        onChange={(event) => setActiveNoteValue("title", event.target.value)}
        style={{ backgroundColor: colors[(activeNote as Note).color] }}
        autoFocus
      />
      <textarea
        {...className(noteBodyStyle, style.noteBody)}
        placeholder="Take a note"
        value={(activeNote as Note).body}
        onChange={(event) => setActiveNoteValue("body", event.target.value)}
        style={{ backgroundColor: colors[(activeNote as Note).color] }}
      ></textarea>
      <div {...className(style.noteSet)}>
        <div {...className(style.btnsCon)}>
          {isEditing && (
            <>
              <button
                disabled={isLoading}
                {...className(style.btnIcon)}
                onClick={() => {
                  if (setIsDelConfOpen) {
                    setIsDelConfOpen(true);
                  }
                }}
                type="button"
                title="Delete"
              >
                <TrashIcon {...className(style.trashIcon)} />
              </button>
              <button
                disabled={isLoading}
                onClick={() => {
                  if (setIsShareNoteOpen) {
                    setIsShareNoteOpen(true);
                  }
                }}
                title="Share"
                type="button"
                {...className(style.btnIcon)}
              >
                <ShareIcon {...className(style.shareIcon)} />
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
            {...className(shared.btn, shared.buttonNotePrimary)}
            style={{ color: colors[(activeNote as Note).color] }}
            type="submit"
          >
            Save
          </button>
          <button
            disabled={isLoading}
            {...className(shared.btn, shared.buttonNoteSecondary)}
            style={{ backgroundColor: colors[(activeNote as Note).color] }}
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

export default Form;
