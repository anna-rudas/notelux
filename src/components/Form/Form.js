import React, { useState, useContext } from "react";
import { className } from "../../helpers";
import TrashIcon from "../../icons/TrashIcon";
import PaletteIcon from "../../icons/PaletteIcon";
import ColorPalette from "../ColorPalette";
import { colors } from "../../constants";
import style from "./Form.module.css";
import shared from "../shared.module.css";
import { AppContext } from "../../context";

function Form({
  handleSubmit,
  handleCancel,

  setFormValue,
  setIsDelConfOpen,

  noteFormStyle,
  noteBodyStyle,
}) {
  const { activeNote, noteColor, setNoteColor, isEditing } =
    useContext(AppContext);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  return (
    <form
      {...className(noteFormStyle, style.noteForm, shared.shadow)}
      onSubmit={handleSubmit}
      style={{ backgroundColor: colors[noteColor] }}
    >
      <input
        {...className(style.noteTitle)}
        maxLength="200"
        type="text"
        placeholder="Title"
        value={activeNote.title}
        onChange={(event) => setFormValue("title", event.target.value)}
        style={{ backgroundColor: colors[noteColor] }}
        autoFocus
      />
      <textarea
        {...className(noteBodyStyle, style.noteBody)}
        placeholder="Take a note"
        value={activeNote.body}
        onChange={(event) => setFormValue("body", event.target.value)}
        style={{ backgroundColor: colors[noteColor] }}
      ></textarea>
      <div {...className(style.noteSet)}>
        <div {...className(style.btnsCon)}>
          {isEditing && (
            <button
              {...className(style.btnIcon)}
              onClick={() => {
                setIsDelConfOpen(true);
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

            {isPaletteOpen && (
              <ColorPalette noteColor={noteColor} setNoteColor={setNoteColor} />
            )}
          </div>
        </div>
        <div {...className(style.btnsCon)}>
          <button
            {...className(shared.btn, style.btnPrimary)}
            style={{ color: colors[noteColor] }}
            type="submit"
          >
            Save
          </button>
          <button
            {...className(shared.btn, style.btnSecondary)}
            style={{ backgroundColor: colors[noteColor] }}
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
