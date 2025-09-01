import React, { useContext } from "react";
import GeneralInput from "../../components/inputs/GeneralInput";
import { AppContext } from "../../context/AppContext";
import { className, evalErrorCode } from "../../utilities/helpers";
import * as style from "./ResetPassword.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";
import { FirebaseError } from "firebase/app";
import PageWrapper from "../../components/templates/PageWrapper";
import { Formik, Form, FormikValues } from "formik";
import { resetPasswordSchema } from "../../utilities/validationSchemas";
import { resetUserPassword } from "../../firebase/authService";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import SecondaryButton from "../../components/buttons/SecondaryButton";

function ResetPassword() {
  const { setToastMessageContent, setIsLoading } = useContext(AppContext);

  const handleResetPassword = async (values: FormikValues) => {
    setIsLoading(true);
    try {
      await resetUserPassword(values.email);
      setToastMessageContent({
        actionButtonText: "",
        isPersisting: false,
        showMessage: true,
        isError: false,
        description: "Email sent! Check your inbox",
      });
    } catch (error: unknown) {
      console.error("Failed to send email: ", error);
      if (error instanceof FirebaseError) {
        setToastMessageContent({
          actionButtonText: "",
          isPersisting: false,
          showMessage: true,
          isError: true,
          description: `Failed to send email: ${evalErrorCode(error.code)}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper useUnauthenticatedStyle={true}>
      <>
        <div
          {...className(
            shared.pageContentContainer,
            style.pageContentContainer
          )}
        >
          <span {...className(textStyles.titleText)}>Reset your password</span>
          <span {...className(textStyles.normalText, textStyles.centerText)}>
            Enter your email address and we will send instructions on how to
            reset your password
          </span>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={resetPasswordSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleResetPassword(values);
              setSubmitting(false);
            }}
          >
            <Form noValidate {...className(style.formContainer)}>
              <GeneralInput
                type="email"
                config={{ name: "email" }}
                placeholder="Email address"
              />
              <div {...className(style.redirectCon)}>
                <SecondaryButton buttonText="Go back" navigateTo="/signin" />
                <PrimaryButton buttonText="Reset password" />
              </div>
            </Form>
          </Formik>
        </div>
      </>
    </PageWrapper>
  );
}

export default ResetPassword;
