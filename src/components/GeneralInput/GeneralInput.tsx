import React, { useState, useContext, useEffect } from "react";
import ShowEyeIcon from "../../icons/ShowEyeIcon";
import HideEyeIcon from "../../icons/HideEyeIcon";
import { className } from "../../helpers";
import * as style from "./GeneralInput.module.css";
import * as shared from "../shared.module.css";
import { AppContext } from "../../context";
import { useField, FieldHookConfig } from "formik";

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

  useEffect(() => {
    setError(meta.touched && meta.error);
  }, [meta]);

  const togglePassVisibility = () => {
    setShowPassword(!showPassword);
  };
  if (props.type == "password") {
    return (
      <div {...className(style.textInputHelper)}>
        <div {...className(style.inputCon, error && style.validationError)}>
          <label
            {...className(
              style.labelText,
              shared.smallText,
              !field.value && style.hideLabelText,
              error && style.labelErrorStyle
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
            {...className(
              shared.btn,
              style.buttonPassVisibility,
              isLoading ? shared.btnDisabled : ""
            )}
            type="button"
            onClick={togglePassVisibility}
          >
            {showPassword ? (
              <HideEyeIcon
                {...className(
                  style.passVisibilityIcon,
                  error && style.iconErrorStyle
                )}
              />
            ) : (
              <ShowEyeIcon
                {...className(
                  style.passVisibilityIcon,
                  error && style.iconErrorStyle
                )}
              />
            )}
          </button>
        </div>
        {error ? (
          <div {...className(style.validationErrorText, shared.smallText)}>
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
      >
        <label
          {...className(
            style.labelText,
            shared.smallText,
            !field.value && style.hideLabelText,
            error && style.labelErrorStyle
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
          type={props.type}
          placeholder={props.placeholder}
        />
      </div>
      {error ? (
        <div {...className(style.validationErrorText, shared.smallText)}>
          {meta.error}
        </div>
      ) : null}
    </div>
  );
}

export default GeneralInput;
