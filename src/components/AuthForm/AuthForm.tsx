import React, { useState, useContext } from "react";
import { className } from "../../helpers";
import * as style from "./AuthForm.module.css";
import * as shared from "../../components/shared.module.css";
import { AppContext } from "../../context";
import ShowEyeIcon from "../../icons/ShowEyeIcon";
import HideEyeIcon from "../../icons/HideEyeIcon";

type AuthFormProps = {
  handleSubmit: (value: React.FormEvent) => Promise<void>;
  primaryButtonText: string;
};

function AuthForm({ handleSubmit, primaryButtonText }: AuthFormProps) {
  const { setEmail, setPassword, isLoading } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} action="#" {...className(style.formCon)}>
      <input
        disabled={isLoading}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        {...className(style.passInputCon)}
        type="text"
        placeholder="Email"
      />
      <div {...className(style.passInputCon)}>
        <input
          disabled={isLoading}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          {...className(style.passInput)}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
        />
        <button
          {...className(shared.btn, style.buttonPassVisibility)}
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

      <button
        disabled={isLoading}
        type="submit"
        {...className(shared.btn, shared.buttonPrimary, shared.buttonSubmit)}
      >
        {primaryButtonText}
      </button>
    </form>
  );
}

export default AuthForm;
