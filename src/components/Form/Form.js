import React, { useState } from "react";
import { className } from "../../helpers";
import TrashIcon from "../../icons/TrashIcon";
import PaletteIcon from "../../icons/PaletteIcon";
import ColorPalette from "../ColorPalette";
import { colors } from "../../constants";
import style from "./Form.module.css";
import shared from "../shared.module.css";

function Form({
  handleSubmit,
  handleCancel,
  activeNote,
  setFormValue,
  handleDelete,
  noteColor,
  setNoteColor,
  noteFormStyle,
  noteBodyStyle,
  isEditing,
}) {
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
              onClick={handleDelete}
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
            {...className(style.btn, style.btnPrimary)}
            style={{ color: colors[noteColor] }}
            type="submit"
          >
            Save
          </button>
          <button
            {...className(style.btn, style.btnSecondary)}
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
