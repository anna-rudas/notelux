import React, { useContext } from "react";
import { className } from "../../utilities/helpers";
import * as style from "./AuthForm.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import { AppContext } from "../../context/AppContext";
import GeneralInput from "../GeneralInput";
import { Formik, Form, FormikValues } from "formik";
import { signInSchema, signUpSchema } from "../../utilities/validationSchemas";

type AuthFormProps = {
  handleSubmit: (v: FormikValues) => void;
  primaryButtonText: string;
  showUsername?: boolean;
};

function AuthForm({
  handleSubmit,
  primaryButtonText,
  showUsername,
}: AuthFormProps) {
  const { isLoading } = useContext(AppContext);

  return (
    <Formik
      initialValues={
        showUsername
          ? { username: "", email: "", password: "" }
          : { email: "", password: "" }
      }
      validationSchema={showUsername ? signUpSchema : signInSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values);
        setSubmitting(false);
      }}
    >
      <Form noValidate {...className(style.formCon)}>
        {showUsername && (
          <GeneralInput
            type="text"
            config={{ name: "username" }}
            placeholder="Username"
          />
        )}
        <GeneralInput
          type="email"
          config={{ name: "email" }}
          placeholder="Email address"
        />
        <GeneralInput
          type="password"
          config={{ name: "password" }}
          placeholder="Password"
        />
        <button
          disabled={isLoading}
          type="submit"
          {...className(
            shared.btn,
            shared.buttonPrimary,
            isLoading ? shared.btnDisabled : ""
          )}
        >
          {primaryButtonText}
        </button>
      </Form>
    </Formik>
  );
}

export default AuthForm;
