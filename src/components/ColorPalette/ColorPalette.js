import React from "react";
import { className } from "../../helpers";
import style from "./ColorPalette.module.css";
import shared from "../shared.module.css";
import { colorInputs } from "../../constants";
import { colors } from "../../constants";

function ChangeBackground({ noteColor, setnoteColor }) {
  return (
    <div {...className(style.colorsCon, shared.shadow)}>
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
              onClick={(event) => {
                setnoteColor(event.target.value);
              }}
              autoFocus={currentInput === noteColor}
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
