import React, { useContext } from "react";
import { className } from "../../helpers";
import * as style from "./ColorPalette.module.css";
import { colorInputs } from "../../constants";
import { colors } from "../../constants";
import { AppContext } from "../../context";

function ChangeBackground() {
  const { activeNote, setActiveNoteValue } = useContext(AppContext);
  return (
    <div {...className(style.colorsCon)}>
      {colorInputs.map((currentInput) => {
        return (
          <label key={currentInput} {...className(style.radioCon)}>
            <input
              {...className(style.radioInput)}
              style={{ backgroundColor: colors[currentInput] }}
              type="radio"
              name="bg-color"
              value={currentInput}
              aria-label={currentInput}
              onClick={() => {
                setActiveNoteValue("color", currentInput);
              }}
              autoFocus={currentInput === activeNote?.color}
            />
            <div
              title={currentInput}
              {...className(style.colorRec)}
              style={{ backgroundColor: colors[currentInput] }}
            ></div>
          </label>
        );
      })}
    </div>
  );
}

export default ChangeBackground;
