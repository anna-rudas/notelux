import React, { useContext } from "react";
import * as style from "./CreateAccount.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";
import { className, evalErrorCode } from "../../utilities/helpers";
import { AppContext } from "../../context/AppContext";
import { FirebaseError } from "firebase/app";
import AuthForm from "../../components/templates/AuthForm";
import PageWrapper from "../../components/templates/PageWrapper";
import { FormikValues } from "formik";
import {
  sendVerificationEmail,
  createUserAccountToPermanent,
} from "../../firestore/authService";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateUserInDb } from "../../firestore/userService";

function CreateAccount() {
  const { setIsLoading, setToastMessageContent, user } = useContext(AppContext);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const handleCreateAccount = async (values: FormikValues) => {
    setIsLoading(true);

    try {
      const createAccountResult = await createUserAccountToPermanent(
        values.email,
        values.password
      );
      if (createAccountResult && user) {
        try {
          await sendVerificationEmail();

          try {
            await updateUserInDb({
              ...user,
              email: values.email,
              username: values.username,
            });
            navigate("/signin");
            setSearchParams({ createAccountSuccess: "true" });
            navigate(0);
          } catch (error: unknown) {
            console.error("Failed to update user in database: ", error);
            if (error instanceof FirebaseError) {
              setToastMessageContent({
                actionButtonText: "",
                isPersisting: false,
                showMessage: true,
                isError: true,
                description: `Failed to update user in database: ${evalErrorCode(
                  error.code
                )}`,
              });
            }
            setIsLoading(false);
          }
        } catch (error: unknown) {
          console.error("Failed to send verification email: ", error);
          if (error instanceof FirebaseError) {
            setToastMessageContent({
              actionButtonText: "",
              isPersisting: false,
              showMessage: true,
              isError: true,
              description: `Failed to send verification email: ${evalErrorCode(
                error.code
              )}`,
            });
          }
          setIsLoading(false);
        }
      }
    } catch (error: unknown) {
      console.error("Failed to create account: ", error);
      if (error instanceof FirebaseError) {
        setToastMessageContent({
          actionButtonText: "",
          isPersisting: false,
          showMessage: true,
          isError: true,
          description: `Failed to create account: ${evalErrorCode(error.code)}`,
        });
      }
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
          <span {...className(textStyles.titleText)}>Create your account</span>
          <span {...className(textStyles.normalText, textStyles.centerText)}>
            By creating a permanent account you will be able to share your notes
            and access them anywhere, anytime.
          </span>
          <AuthForm
            handleSubmit={handleCreateAccount}
            primaryButtonText="Create account"
            showUsername={true}
          />
          <div {...className(style.redirectCon)}>
            <SecondaryButton buttonText="Go back" navigateTo="/dashboard" />
          </div>
        </div>
      </>
    </PageWrapper>
  );
}

export default CreateAccount;
