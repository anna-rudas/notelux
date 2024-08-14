import React, { useContext } from "react";
import GeneralInput from "../../components/GeneralInput";
import { AppContext } from "../../context/AppContext";
import { className, evalErrorCode } from "../../utilities/helpers";
import * as sharedPages from "../../assets/styles/sharedPages.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper";
import { Formik, Form, FormikValues } from "formik";
import { resetPasswordSchema } from "../../utilities/validationSchemas";
import { resetUserPassword } from "../../firestore/authService";

function ResetPassword() {
  const { setInfoMessage, isLoading, setIsLoading } = useContext(AppContext);

  const handleResetPassword = async (values: FormikValues) => {
    setIsLoading(true);
    try {
      await resetUserPassword(values.email);
      setInfoMessage({
        actionButtonText: "",
        isPersisting: false,
        showMsg: true,
        isError: false,
        desc: "Email sent! Check your inbox",
      });
    } catch (error: unknown) {
      console.error("Failed to send email: ", error);
      if (error instanceof FirebaseError) {
        setInfoMessage({
          actionButtonText: "",
          isPersisting: false,
          showMsg: true,
          isError: true,
          desc: `Failed to send email: ${evalErrorCode(error.code)}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper useUnauthenticatedStyle={true}>
      <>
        <div {...className(sharedPages.contentCon)}>
          <span {...className(shared.titleText)}>Reset your password</span>
          <span {...className(shared.normalText)}>
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
            <Form
              noValidate
              {...className(
                sharedPages.settingsItemCon,
                sharedPages.settingsItemConName
              )}
            >
              <GeneralInput
                type="email"
                config={{ name: "email" }}
                placeholder="Email address"
              />
              <div {...className(sharedPages.redirectCon)}>
                <Link
                  to="/signin"
                  {...className(
                    shared.btn,
                    shared.buttonSecondary,
                    isLoading && shared.disabledLink
                  )}
                >
                  Go back
                </Link>
                <button
                  disabled={isLoading}
                  type="submit"
                  {...className(
                    shared.btn,
                    shared.buttonPrimary,
                    isLoading ? shared.btnDisabled : ""
                  )}
                >
                  Reset password
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </>
    </PageWrapper>
  );
}

export default ResetPassword;
