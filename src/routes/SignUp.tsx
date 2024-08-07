import React, { useContext } from "react";
import * as style from "./Routes.module.css";
import * as shared from "../components/shared.module.css";
import { Link } from "react-router-dom";
import { className, evalErrorCode } from "../helpers";
import { AppContext } from "../context";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import AuthForm from "../components/AuthForm";
import PageWrapper from "../components/PageWrapper";
import { FormikValues } from "formik";
import { defaultLayout, defaultTheme } from "../constants";

function SignUp() {
  const {
    isLoading,
    setIsLoading,
    addUserInDb,
    infoMessage,
    setInfoMessage,
    setUser,
    setUserId,
  } = useContext(AppContext);

  const auth = getAuth();

  const sendVerifyEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, {
          url: "http://localhost:1234/signin",
        });
        setInfoMessage({
          actionButtonText: "",
          isPersisting: false,
          showMsg: true,
          isError: false,
          desc: "Verify your email address to sign in",
        });
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to send verification email: ", error.code);
        setInfoMessage({
          ...infoMessage,
          showMsg: true,
          isError: true,
          desc: `Failed to send verification email: ${evalErrorCode(
            error.code
          )}`,
        });
      }
    }
  };

  const handleSignUp = async (values: FormikValues) => {
    setIsLoading(true);
    try {
      const signUpResult = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      if (signUpResult && signUpResult.user.email) {
        await addUserInDb({
          id: signUpResult.user.uid,
          email: signUpResult.user.email,
          theme: defaultTheme,
          username: values.username,
          layout: defaultLayout,
        });
        await sendVerifyEmail();
        try {
          if (auth.currentUser) {
            await signOut(auth);
            setUser(null);
            setUserId(null);
          }
        } catch (error: unknown) {
          if (error instanceof FirebaseError) {
            console.error("Failed to sign out user: ", error.code);
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to sign up user: ", error.code);
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
        <div {...className(style.contentCon)}>
          <span {...className(shared.titleText)}>Sign up</span>
          <AuthForm
            handleSubmit={handleSignUp}
            primaryButtonText="Sign up"
            isName={true}
          />
          <div {...className(style.redirectCon)}>
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
