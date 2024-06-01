import React, { useState, useContext } from "react";
import { className } from "../../helpers";
import TrashIcon from "../../icons/TrashIcon";
import PaletteIcon from "../../icons/PaletteIcon";
import ColorPalette from "../ColorPalette";
import { colors } from "../../constants";
import * as style from "./Form.module.css";
import * as shared from "../shared.module.css";
import { AppContext } from "../../context";

type FormProps = {
  handleSubmit: () => void;
  handleCancel: () => void;
  setIsDelConfOpen?: (value: boolean) => void;
  noteFormStyle: string;
  noteBodyStyle: string;
};

function Form({
  handleSubmit,
  handleCancel,
  setIsDelConfOpen,
  noteFormStyle,
  noteBodyStyle,
}: FormProps) {
  const { activeNote, isEditing, setActiveNoteValue } = useContext(AppContext);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  return (
    <form
      {...className(noteFormStyle, style.noteForm, shared.shadow)}
      onSubmit={handleSubmit}
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
            <button
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
          )}
          <div {...className(style.paletteCon)}>
            <button
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
            {...className(shared.btn, shared.buttonNotePrimary)}
            style={{ color: colors[(activeNote as Note).color] }}
            type="submit"
          >
            Save
          </button>
          <button
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
