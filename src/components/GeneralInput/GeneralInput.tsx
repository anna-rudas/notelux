import React, { useState, useContext } from "react";
import ShowEyeIcon from "../../icons/ShowEyeIcon";
import HideEyeIcon from "../../icons/HideEyeIcon";
import { className } from "../../helpers";
import * as style from "./GeneralInput.module.css";
import * as shared from "../shared.module.css";
import { AppContext } from "../../context";

type GeneralInputProps = {
  inputValue?: string;
  setInputValue: (value: string) => void;
  isPassword?: boolean;
  isDisabled?: boolean;
  placeholder: string;
};

function GeneralInput({
  inputValue,
  setInputValue,
  isPassword,
  isDisabled,
  placeholder,
}: GeneralInputProps) {
  const { isLoading } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassVisibility = () => {
    setShowPassword(!showPassword);
  };
  if (isPassword) {
    return (
      <div {...className(style.inputCon)}>
        <input
          disabled={isDisabled}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
        />

        <button
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
    );
  }

  return (
    <input
      disabled={isDisabled}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      {...className(style.inputCon)}
      type="text"
      placeholder={placeholder}
      value={inputValue}
    />
  );
}

export default GeneralInput;
