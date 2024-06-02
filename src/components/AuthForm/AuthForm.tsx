import React, { useContext } from "react";
import { className } from "../../helpers";
import * as style from "./AuthForm.module.css";
import * as shared from "../../components/shared.module.css";
import { AppContext } from "../../context";
import GeneralInput from "../GeneralInput";

type AuthFormProps = {
  handleSubmit: (value: React.FormEvent) => Promise<void>;
  primaryButtonText: string;
  setName?: (value: string) => void;
};

function AuthForm({ handleSubmit, primaryButtonText, setName }: AuthFormProps) {
  const { setEmail, setPassword, isLoading } = useContext(AppContext);

  return (
    <form onSubmit={handleSubmit} action="#" {...className(style.formCon)}>
      {setName && <GeneralInput setInputValue={setName} placeholder="Name" />}
      <GeneralInput setInputValue={setEmail} placeholder="Email" />
      <GeneralInput
        setInputValue={setPassword}
        placeholder="Password"
        isPassword={true}
      />
      <button
        disabled={isLoading}
        type="submit"
        {...className(shared.btn, shared.buttonPrimary)}
      >
        {primaryButtonText}
      </button>
    </form>
  );
}

export default AuthForm;
