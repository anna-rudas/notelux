import React, { useContext } from "react";
import { Formik, Form, FormikValues } from "formik";
import { settingsSchema } from "../../../utilities/validationSchemas";
import GeneralInput from "../../../components/inputs/GeneralInput";
import { AppContext } from "../../../context/AppContext";
import { className } from "../../../utilities/helpers";
import * as style from "./ChangeUsername.module.css";
import * as textStyles from "../../../assets/styles/text-styles.module.css";
import PrimaryButton from "../../buttons/PrimaryButton";

function ChangeUsername() {
  const { user, setToastMessageContent, setUser, setIsLoading } =
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
      <span {...className(textStyles.subtitleText)}>Name</span>
      <span {...className(textStyles.normalText)}>
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
          <PrimaryButton buttonText="Save changes" />
        </Form>
      </Formik>
    </>
  );
}

export default ChangeUsername;
