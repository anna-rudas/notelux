import React, { useState, useContext } from "react";
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

  const togglePassVisibility = () => {
    setShowPassword(!showPassword);
  };
  if (props.type == "password") {
    return (
      <div {...className(style.textInputHelper)}>
        <div
          {...className(
            style.inputCon,
            meta.touched && meta.error && style.validationError
          )}
        >
          <input
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
              <HideEyeIcon {...className(style.passVisibilityIcon)} />
            ) : (
              <ShowEyeIcon {...className(style.passVisibilityIcon)} />
            )}
          </button>
        </div>
        {meta.touched && meta.error ? (
          <div {...className(style.validationErrorText)}>{meta.error}</div>
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
        <input
          {...field}
          {...props}
          disabled={isLoading}
          type={props.type}
          placeholder={props.placeholder}
        />
      </div>
      {meta.touched && meta.error ? (
        <div {...className(style.validationErrorText)}>{meta.error}</div>
      ) : null}
    </div>
  );
}

export default GeneralInput;
