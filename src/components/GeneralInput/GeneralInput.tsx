import React, { useState, useContext, useEffect } from "react";
import ShowEyeIcon from "../../assets/icons/ShowEyeIcon";
import HideEyeIcon from "../../assets/icons/HideEyeIcon";
import { className } from "../../utilities/helpers";
import * as style from "./GeneralInput.module.css";
import * as buttons from "../../assets/styles/buttons.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";
import { AppContext } from "../../context/AppContext";
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
      >
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
          type={props.type}
          placeholder={props.placeholder}
        />
      </div>
      {error ? (
        <div {...className(style.validationErrorText, textStyles.smallText)}>
          {meta.error}
        </div>
      ) : null}
    </div>
  );
}

export default GeneralInput;
