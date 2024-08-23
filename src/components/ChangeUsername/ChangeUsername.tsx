import React, { useContext } from "react";
import { Formik, Form, FormikValues } from "formik";
import { settingsSchema } from "../../utilities/validationSchemas";
import GeneralInput from "../../components/GeneralInput";
import { AppContext } from "../../context/AppContext";
import { className } from "../../utilities/helpers";
import * as shared from "../../assets/styles/shared.module.css";
import * as style from "./ChangeUsername.module.css";

function ChangeUsername() {
  const { user, setToastMessageContent, setUser, setIsLoading, isLoading } =
    useContext(AppContext);

  const handleChangeUsername = (values: FormikValues) => {
    setIsLoading(true);
    if (user) {
      setUser({ ...user, username: values.username });
    }
    setToastMessageContent({
      showMessage: true,
      actionButtonText: "",
      isPersisting: false,
      isError: false,
      description: "Username updated successfully",
    });
    setIsLoading(false);
  };

  return (
    <>
      <span {...className(shared.secondaryTitleText)}>Name</span>
      <span {...className(shared.normalText)}>
        Set what name to display in the menu
      </span>
      <Formik
        initialValues={{ username: user?.username }}
        validationSchema={settingsSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleChangeUsername(values);
          setSubmitting(false);
        }}
      >
        <Form noValidate {...className(style.usernameCon)}>
          <GeneralInput
            type="username"
            config={{ name: "username" }}
            placeholder="Username"
          />
          <button
            disabled={isLoading}
            type="submit"
            {...className(
              shared.btn,
              shared.buttonPrimary,
              isLoading && shared.btnDisabled
            )}
          >
            Save changes
          </button>
        </Form>
      </Formik>
    </>
  );
}

export default ChangeUsername;
