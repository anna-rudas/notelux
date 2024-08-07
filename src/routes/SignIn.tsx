import React, { useContext, useEffect } from "react";
import * as style from "./Routes.module.css";
import * as shared from "../components/shared.module.css";
import { Link } from "react-router-dom";
import { className, evalErrorCode } from "../helpers";
import { AppContext } from "../context";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import AuthForm from "../components/AuthForm";
import PageWrapper from "../components/PageWrapper";
import { FormikValues } from "formik";

function SignIn() {
  const {
    isLoading,
    setIsLoading,
    user,
    infoMessage,
    setInfoMessage,
    setUserId,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

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
          desc: "Verification email sent",
        });
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to send verification email: ", error.code);
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
  };

  const handleSignIn = async (values: FormikValues) => {
    setIsLoading(true);
    try {
      const signInResult = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      if (signInResult.user.emailVerified) {
        setInfoMessage({
          ...infoMessage,
          showMsg: false,
        });
        setUserId(signInResult.user.uid);
      } else {
        setInfoMessage({
          isPersisting: true,
          actionButtonText: "Resend email",
          showMsg: true,
          isError: true,
          desc: "Your email address is not verified",
        });
        setIsLoading(false);
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to sign in user: ", error.code);
        setInfoMessage({
          actionButtonText: "",
          isPersisting: false,
          showMsg: true,
          isError: true,
          desc: `Failed to sign in: ${evalErrorCode(error.code)}`,
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper infoMsgAction={sendVerifyEmail}>
      <>
        <div {...className(style.contentCon)}>
          <span {...className(shared.titleText)}>Sign in</span>
          <AuthForm handleSubmit={handleSignIn} primaryButtonText="Sign in" />
          <div {...className(style.redirectCon)}>
            <span {...className(shared.normalText)}>
              Don&apos;t have an account yet?
            </span>
            <Link
              to="/signup"
              {...className(
                shared.btn,
                shared.buttonSecondary,
                isLoading && shared.disabledLink
              )}
            >
              Sign up
            </Link>
          </div>
          <div {...className(shared.divider)}></div>
          <Link
            to="/resetpassword"
            {...className(
              shared.btn,
              shared.buttonSecondary,
              isLoading && shared.disabledLink
            )}
          >
            Forgot password?
          </Link>
        </div>
      </>
    </PageWrapper>
  );
}

export default SignIn;
