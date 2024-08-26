import React from "react";
import { className } from "../../../utilities/helpers";
import * as style from "./AuthForm.module.css";
import GeneralInput from "../../inputs/GeneralInput";
import { Formik, Form, FormikValues } from "formik";
import {
  signInSchema,
  signUpSchema,
} from "../../../utilities/validationSchemas";
import PrimaryButton from "../../buttons/PrimaryButton";

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
        <PrimaryButton buttonText={primaryButtonText} />
      </Form>
    </Formik>
  );
}

export default AuthForm;
