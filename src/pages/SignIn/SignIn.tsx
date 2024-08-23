import React, { useContext, useEffect } from "react";
import * as style from "./SignIn.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import { Link, useSearchParams } from "react-router-dom";
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
    toastMessageContent,
    setToastMessageContent,
    setAuthenticatedUserId,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  useEffect(() => {
    if (searchParams.get("verificationEmailSent") === "true") {
      setToastMessageContent({
        actionButtonText: "",
        isPersisting: true,
        showMessage: true,
        isError: false,
        description:
          "You have been signed out. Verify your new email address before signing in.",
      });
    }
    setSearchParams({});
  }, [searchParams]);

  const handleSendVerifyEmail = async () => {
    setIsLoading(true);
    try {
      await sendVerificationEmail();
      setToastMessageContent({
        actionButtonText: "",
        isPersisting: false,
        showMessage: true,
        isError: false,
        description: "Verification email sent",
      });
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (values: FormikValues) => {
    setIsLoading(true);
    try {
      const signInResult = await signInUser(values.email, values.password);
      if (isUserEmailVerified(signInResult)) {
        setToastMessageContent({
          ...toastMessageContent,
          showMessage: false,
        });
        setAuthenticatedUserId(signInResult.user.uid);
      } else {
        setToastMessageContent({
          isPersisting: true,
          actionButtonText: "Resend email",
          showMessage: true,
          isError: true,
          description: "Your email address is not verified",
        });
        setIsLoading(false);
      }
    } catch (error: unknown) {
      console.error("Failed to sign in user: ", error);
      if (error instanceof FirebaseError) {
        setToastMessageContent({
          actionButtonText: "",
          isPersisting: false,
          showMessage: true,
          isError: true,
          description: `Failed to sign in: ${evalErrorCode(error.code)}`,
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper
      toastMessageAction={handleSendVerifyEmail}
      useUnauthenticatedStyle={true}
    >
      <>
        <div {...className(shared.pageContentContainer)}>
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
