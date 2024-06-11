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
import InformationMessage from "../components/InformationMessage";
import PageWrapper from "../components/PageWrapper";
import { FormikValues } from "formik";

function SignUp() {
  const { isLoading, setIsLoading, addUserInDb, infoMessage, setInfoMessage } =
    useContext(AppContext);

  const auth = getAuth();

  const sendVerifyEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, {
          url: "http://localhost:1234/signin",
        });
        setInfoMessage({
          isPersisting: false,
          showMsg: true,
          isError: false,
          desc: "Verify your email address to sign in",
        });
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(error.code);
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
        addUserInDb({
          id: signUpResult.user.uid,
          email: signUpResult.user.email,
          username: values.username,
        });
        sendVerifyEmail();
        try {
          if (auth.currentUser) {
            await signOut(auth);
          }
        } catch (error: unknown) {
          if (error instanceof FirebaseError) {
            console.error(error.code);
          }
        }
      }
      setIsLoading(false);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(error.code);
        setIsLoading(false);
        setInfoMessage({
          isPersisting: false,
          showMsg: true,
          isError: true,
          desc: `Failed to sign up: ${evalErrorCode(error.code)}`,
        });
      }
    }
  };

  return (
    <PageWrapper isAuthStlye={false}>
      <>
        <div {...className(style.contentCon)}>
          <span {...className(shared.titleText)}>Sign up</span>
          <AuthForm
            handleSubmit={handleSignUp}
            primaryButtonText="Sign up"
            isName={true}
          />
          <div {...className(style.redirectCon)}>
            <span>Already have an account?</span>
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
        {infoMessage.showMsg && (
          <InformationMessage
            actionButtonText={infoMessage.isPersisting ? "Resend email" : ""}
            actionButtonHandle={sendVerifyEmail}
            description={infoMessage.desc}
            isError={infoMessage.isError}
          />
        )}
      </>
    </PageWrapper>
  );
}

export default SignUp;
