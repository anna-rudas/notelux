import React, { useContext } from "react";
import * as style from "./SignUp.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import * as buttons from "../../assets/styles/buttons.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";
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
      if (signUpResult.user.email) {
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
        <div {...className(shared.pageContentContainer)}>
          <span {...className(textStyles.titleText)}>Sign up</span>
          <AuthForm
            handleSubmit={handleSignUp}
            primaryButtonText="Sign up"
            showUsername={true}
          />
          <div {...className(style.redirectCon)}>
            <span {...className(textStyles.normalText)}>
              Already have an account?
            </span>
            <Link
              to="/signin"
              {...className(buttons.btn, buttons.buttonSecondary)}
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
