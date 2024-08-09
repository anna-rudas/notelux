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

function SignUp() {
  const { isLoading, setIsLoading, setInfoMessage, setUser, setUserId } =
    useContext(AppContext);

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
            setInfoMessage({
              actionButtonText: "",
              isPersisting: false,
              showMsg: true,
              isError: false,
              desc: "Verify your email address to sign in",
            });
            try {
              await signOutUser();
              setUser(null);
              setUserId(null);
            } catch (error: unknown) {
              console.error("Failed to sign out user: ", error);
            }
          } catch (error: unknown) {
            console.error("Failed to send verification email: ", error);
            if (error instanceof FirebaseError) {
              setInfoMessage({
                actionButtonText: "",
                isPersisting: false,
                showMsg: true,
                isError: true,
                desc: `Failed to send verification email: ${evalErrorCode(
                  error.code
                )}`,
              });
            }
          }
        } catch (error: unknown) {
          console.error("Failed to add user: ", error);
        }
      }
    } catch (error: unknown) {
      console.error("Failed to sign up user: ", error);
      if (error instanceof FirebaseError) {
        setInfoMessage({
          actionButtonText: "",
          isPersisting: false,
          showMsg: true,
          isError: true,
          desc: `Failed to sign up: ${evalErrorCode(error.code)}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <>
        <div {...className(sharedPages.contentCon)}>
          <span {...className(shared.titleText)}>Sign up</span>
          <AuthForm
            handleSubmit={handleSignUp}
            primaryButtonText="Sign up"
            isName={true}
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
