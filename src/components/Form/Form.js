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
  note,
  setFormValue,
  handleDelete,
  bgColor,
  setBgColor,
  noteFormStyle,
  noteBodyStyle,
  isEditing,
}) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  return (
    <form
      {...className(noteFormStyle, style.noteForm, shared.shadow)}
      onSubmit={handleSubmit}
      style={{ backgroundColor: colors[bgColor] }}
    >
      <input
        {...className(style.noteTitle)}
        maxLength="200"
        type="text"
        placeholder="Title"
        value={note.title}
        onChange={(event) => setFormValue("title", event.target.value)}
        style={{ backgroundColor: colors[bgColor] }}
        autoFocus
      />
      <textarea
        {...className(noteBodyStyle, style.noteBody)}
        placeholder="Take a note"
        value={note.body}
        onChange={(event) => setFormValue("body", event.target.value)}
        style={{ backgroundColor: colors[bgColor] }}
      ></textarea>
      <div {...className(style.noteSet)}>
        <div {...className(style.btnsCon)}>
          {isEditing && (
            <button
              {...className(style.btnIcon)}
              onClick={handleDelete}
              type="button"
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
            >
              <PaletteIcon {...className(style.paletteIcon)} />
            </button>

            {isPaletteOpen && (
              <ColorPalette bgColor={bgColor} setBgColor={setBgColor} />
            )}
          </div>
        </div>
        <div {...className(style.btnsCon)}>
          <button {...className(style.btn, style.btnPrimary)} type="submit">
            Save
          </button>
          <button
            style={{ backgroundColor: colors[bgColor] }}
            {...className(style.btn, style.btnSecondary)}
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
