import React, { useContext } from "react";
import { className } from "../../helpers";
import * as style from "./AuthForm.module.css";
import * as shared from "../../components/shared.module.css";
import { AppContext } from "../../context";
import GeneralInput from "../GeneralInput";
import { Formik, Form, FormikValues } from "formik";
import { signInSchema, signUpSchema } from "../../validationSchemas";

type AuthFormProps = {
  handleSubmit: (v: FormikValues) => void;
  primaryButtonText: string;
  isName?: boolean;
};

function AuthForm({ handleSubmit, primaryButtonText, isName }: AuthFormProps) {
  const { isLoading } = useContext(AppContext);

  return (
    <Formik
      initialValues={
        isName
          ? { username: "", email: "", password: "" }
          : { email: "", password: "" }
      }
      validationSchema={isName ? signUpSchema : signInSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values);
        setSubmitting(false);
      }}
    >
      <Form {...className(style.formCon)}>
        {isName && (
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
          {...className(shared.btn, shared.buttonPrimary)}
        >
          {primaryButtonText}
        </button>
      </Form>
    </Formik>
  );
}

export default AuthForm;
