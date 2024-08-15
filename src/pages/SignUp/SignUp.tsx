import React, { useContext } from "react";
import * as sharedPages from "../../assets/styles/sharedPages.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import { Link } from "react-router-dom";
import { className, evalErrorCode } from "../../utilities/helpers";
import { AppContext } from "../../context/AppContext";
import { FirebaseError } from "firebase/app";
import AuthForm from "../../components/AuthForm";
import PageWrapper from "../../components/PageWrapper";
import { FormikValues } from "formik";
import { defaultLayout, defaultTheme } from "../../data/constants";
import {
  signUpUser,
  sendVerificationEmail,
  signOutUser,
} from "../../firestore/authService";
import { addUserInDb } from "../../firestore/userService";
import { useErrorBoundary } from "react-error-boundary";

function SignUp() {
  const {
    isLoading,
    setIsLoading,
    setToastMessageContent,
    setUser,
    setAuthenticatedUserId,
  } = useContext(AppContext);

  const { showBoundary } = useErrorBoundary();

  const handleSignUp = async (values: FormikValues) => {
    setIsLoading(true);
    try {
      const signUpResult = await signUpUser(values.email, values.password);
      if (signUpResult && signUpResult.user.email) {
        try {
          await addUserInDb({
            id: signUpResult.user.uid,
            email: signUpResult.user.email,
            theme: defaultTheme,
            username: values.username,
            layout: defaultLayout,
          });
          try {
            await sendVerificationEmail();
            setToastMessageContent({
              actionButtonText: "",
              isPersisting: false,
              showMessage: true,
              isError: false,
              description: "Verify your email address to sign in",
            });
            try {
              await signOutUser();
              setUser(null);
              setAuthenticatedUserId(null);
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
          }
        } catch (error: unknown) {
          console.error("Failed to add user: ", error);
          showBoundary(error);
        }
      }
    } catch (error: unknown) {
      console.error("Failed to sign up user: ", error);
      if (error instanceof FirebaseError) {
        setToastMessageContent({
          actionButtonText: "",
          isPersisting: false,
          showMessage: true,
          isError: true,
          description: `Failed to sign up: ${evalErrorCode(error.code)}`,
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
          <span {...className(shared.titleText)}>Sign up</span>
          <AuthForm
            handleSubmit={handleSignUp}
            primaryButtonText="Sign up"
            showUsername={true}
          />
          <div {...className(sharedPages.redirectCon)}>
            <span {...className(shared.normalText)}>
              Already have an account?
            </span>
            <Link
              to="/signin"
              {...className(
                shared.btn,
                shared.buttonSecondary,
                isLoading && shared.disabledLink
              )}
            >
              Sign in
            </Link>
          </div>
        </div>
      </>
    </PageWrapper>
  );
}

export default SignUp;
