import React, { useState, useContext, useEffect } from "react";
import ShowEyeIcon from "../../../assets/icons/ShowEyeIcon";
import HideEyeIcon from "../../../assets/icons/HideEyeIcon";
import { className } from "../../../utilities/helpers";
import * as style from "./GeneralInput.module.css";
import * as buttons from "../../../assets/styles/buttons.module.css";
import * as textStyles from "../../../assets/styles/text-styles.module.css";
import { useField, FieldHookConfig } from "formik";
import { AppContext } from "../../../context/AppContext";
import { DashboardContext } from "../../../context/DashboardContext";
import { colors, errorColors } from "../../../data/constants";

type GeneralInputProps<T> = {
  placeholder: string;
  type: string;
  config: FieldHookConfig<T>;
};

function GeneralInput(props: GeneralInputProps<string>) {
  const { isLoading } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const [field, meta] = useField(props.config);
  const [error, setError] = useState(meta.touched && meta.error);
  const { activeNote } = useContext(DashboardContext);
  const { user } = useContext(AppContext);

  useEffect(() => {
    setError(meta.touched && meta.error);
  }, [meta]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (props.type == "password") {
    return (
      <div {...className(style.textInputHelper)}>
        <div {...className(style.inputCon, error && style.validationError)}>
          <label
            {...className(
              style.labelText,
              textStyles.smallText,
              !field.value && style.hideLabelText,
              error && style.labelError
            )}
            htmlFor={props.config.name}
          >
            {props.placeholder}
          </label>
          <input
            id={props.config.name}
            {...field}
            {...props}
            disabled={isLoading}
            type={showPassword ? "text" : "password"}
            placeholder={props.placeholder}
          />

          <button
            disabled={isLoading}
            {...className(buttons.btn, style.buttonPasswordVisibility)}
            type="button"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <HideEyeIcon
                {...className(
                  style.passwordVisibilityIcon,
                  error && style.iconError
                )}
              />
            ) : (
              <ShowEyeIcon
                {...className(
                  style.passwordVisibilityIcon,
                  error && style.iconError
                )}
              />
            )}
          </button>
        </div>
        {error ? (
          <div {...className(style.validationErrorText, textStyles.smallText)}>
            {meta.error}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div {...className(style.textInputHelper)}>
      <div
        {...className(
          style.inputCon,
          meta.touched && meta.error && style.validationError
        )}
        style={
          activeNote && user?.theme === "light" && meta.touched && meta.error
            ? {
                backgroundColor: colors[activeNote.color],
                border: `2px solid ${errorColors[activeNote.color]}`,
              }
            : activeNote && user?.theme === "light"
            ? {
                backgroundColor: colors[activeNote.color],
              }
            : {}
        }
      >
        <label
          {...className(
            style.labelText,
            textStyles.smallText,
            !field.value && style.hideLabelText,
            error && style.labelError
          )}
          style={
            activeNote && user?.theme === "light" && error
              ? {
                  color: errorColors[activeNote.color],
                  backgroundColor: colors[activeNote.color],
                }
              : activeNote && user?.theme === "light"
              ? {
                  backgroundColor: colors[activeNote.color],
                }
              : {}
          }
          htmlFor={props.config.name}
        >
          {props.placeholder}
        </label>
        <input
          style={
            activeNote && user?.theme === "light"
              ? { backgroundColor: colors[activeNote.color] }
              : {}
          }
          id={props.config.name}
          {...field}
          {...props}
          disabled={isLoading}
          type={props.type}
          placeholder={props.placeholder}
        />
      </div>
      {error ? (
        <div
          {...className(style.validationErrorText, textStyles.smallText)}
          style={
            activeNote && user?.theme === "light"
              ? { color: errorColors[activeNote.color] }
              : {}
          }
        >
          {meta.error}
        </div>
      ) : null}
    </div>
  );
}

export default GeneralInput;
