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
  signOutUser,
} from "../../firestore/authService";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateUserInDb } from "../../firestore/userService";
import { User } from "../../types/types";

function CreateAccount() {
  const {
    setIsLoading,
    setToastMessageContent,
    user,
    setUser,
    setAnonymousUserId,
    setAuthenticatedUserId,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const updateUserData = async (userData: User) => {
    try {
      await updateUserInDb(userData);
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
    }
  };

  const handleCreateAccount = async (values: FormikValues) => {
    setIsLoading(true);

    if (user === null) {
      throw new Error(
        "expected anonymous user to be signed in when creating account"
      );
    }
    const userData = { ...user };

    await updateUserData({
      ...userData,
      email: values.email,
      username: values.username,
    });

    setUser(null);
    setAnonymousUserId(null);
    setAuthenticatedUserId(null);
    setIsLoading(true);

    try {
      const createAccountResult = await createUserAccountToPermanent(
        values.email,
        values.password
      );
      if (createAccountResult) {
        try {
          await sendVerificationEmail();
          try {
            await signOutUser();
            navigate("/signin");
            setSearchParams({
              createAccountSuccess: "true",
            });
            setIsLoading(false);
          } catch (error: unknown) {
            console.error("Failed to sign out user: ", error);
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
      await updateUserData(userData);
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
