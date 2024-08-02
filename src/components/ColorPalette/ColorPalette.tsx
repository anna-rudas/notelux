import React, { useContext } from "react";
import { className } from "../../utilities/helpers";
import * as style from "./ColorPalette.module.css";
import { colorInputs } from "../../data/constants";
import { colors } from "../../data/constants";
import { AppContext } from "../../context/context";

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
