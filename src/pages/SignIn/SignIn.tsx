import React, { useContext, useEffect } from "react";
import * as sharedPages from "../../assets/styles/sharedPages.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import { Link } from "react-router-dom";
import { className, evalErrorCode } from "../../utilities/helpers";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import AuthForm from "../../components/AuthForm";
import PageWrapper from "../../components/PageWrapper";
import { FormikValues } from "formik";
import {
  signInUser,
  isUserEmailVerified,
  sendVerificationEmail,
} from "../../firestore/authService";

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

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  const handleSendVerifyEmail = async () => {
    setIsLoading(true);
    try {
      await sendVerificationEmail();
      setInfoMessage({
        actionButtonText: "",
        isPersisting: false,
        showMsg: true,
        isError: false,
        desc: "Verification email sent",
      });
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (values: FormikValues) => {
    setIsLoading(true);
    try {
      const signInResult = await signInUser(values.email, values.password);
      if (isUserEmailVerified(signInResult)) {
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
      console.error("Failed to sign in user: ", error);
      if (error instanceof FirebaseError) {
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
    <PageWrapper infoMsgAction={handleSendVerifyEmail}>
      <>
        <div {...className(sharedPages.contentCon)}>
          <span {...className(shared.titleText)}>Sign in</span>
          <AuthForm handleSubmit={handleSignIn} primaryButtonText="Sign in" />
          <div {...className(sharedPages.redirectCon)}>
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
