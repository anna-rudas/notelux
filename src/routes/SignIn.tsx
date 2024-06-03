import React, { useContext, useEffect } from "react";
import Header from "../components/Header";
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
import InformationMessage from "../components/InformationMessage";

function SignIn() {
  const {
    email,
    password,
    isLoading,
    setIsLoading,
    user,
    loadUserFromDb,
    infoMessage,
    setInfoMessage,
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
          isPersisting: false,
          showMsg: true,
          isError: false,
          desc: "Verification email sent",
        });
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(error.code);
        setInfoMessage({
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

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const signInResult = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (signInResult.user.emailVerified) {
        setInfoMessage({
          ...infoMessage,
          showMsg: false,
        });
        loadUserFromDb(signInResult.user.uid);
      } else {
        setInfoMessage({
          isPersisting: true,
          showMsg: true,
          isError: true,
          desc: "Your email address is not verified",
        });
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
          desc: `Failed to sign in: ${evalErrorCode(error.code)}`,
        });
      }
    }
  };

  return (
    <div className="wrapper">
      {isLoading && <div {...className(shared.loadingModal)}></div>}
      <Header loggedInStyle={false} />
      <div {...className(style.contentCon)}>
        <span {...className(shared.titleText)}>Sign in</span>
        <AuthForm handleSubmit={handleSignIn} primaryButtonText="Sign in" />
        <div {...className(style.redirectCon)}>
          <span>Don&apos;t have an account yet?</span>
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
      </div>
      {infoMessage.showMsg && (
        <InformationMessage
          actionButtonText={infoMessage.isPersisting ? "Resend email" : ""}
          actionButtonHandle={sendVerifyEmail}
          description={infoMessage.desc}
          isError={infoMessage.isError}
        />
      )}
    </div>
  );
}

export default SignIn;
