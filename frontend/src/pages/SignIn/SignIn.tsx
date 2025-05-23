import React, { useContext, useEffect } from "react";
import * as style from "./SignIn.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";
import { useSearchParams } from "react-router-dom";
import { className, evalErrorCode } from "../../utilities/helpers";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import AuthForm from "../../components/templates/AuthForm";
import PageWrapper from "../../components/templates/PageWrapper";
import { FormikValues } from "formik";
import {
  signInUser,
  isUserEmailVerified,
  sendVerificationEmail,
  signInAnonymousUser,
  isUserAnonymous,
} from "../../firestore/authService";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import PrimaryButton from "../../components/buttons/PrimaryButton";

function SignIn() {
  const {
    setIsLoading,
    user,
    toastMessageContent,
    setToastMessageContent,
    setAuthenticatedUser,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  useEffect(() => {
    if (searchParams.get("changeEmailSuccess") === "true") {
      setToastMessageContent({
        actionButtonText: "",
        isPersisting: true,
        showMessage: true,
        isError: false,
        description:
          "Email changed successfully. Verify your new email address before signing in.",
      });
    } else if (searchParams.get("createAccountSuccess") === "true") {
      setToastMessageContent({
        actionButtonText: "",
        isPersisting: false,
        showMessage: true,
        isError: false,
        description:
          "Account created successfully. Verify your email address before signing in.",
      });
    } else if (searchParams.get("deleteAccountSuccess") === "true") {
      setToastMessageContent({
        actionButtonText: "",
        isPersisting: false,
        showMessage: true,
        isError: false,
        description: "Account deleted successfully.",
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
        setAuthenticatedUser({ id: signInResult.user.uid, isAnonymous: false });
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

  const handleSignInAnonymousUser = async () => {
    setIsLoading(true);
    try {
      const signInResult = await signInAnonymousUser();
      if (isUserAnonymous(signInResult)) {
        setAuthenticatedUser({ id: signInResult.user.uid, isAnonymous: true });
      }
    } catch (error) {
      console.error("Failed to sign in anonymously: ", error);
    }
  };

  return (
    <PageWrapper
      toastMessageAction={handleSendVerifyEmail}
      useUnauthenticatedStyle={true}
    >
      <>
        <div {...className(shared.pageContentContainer)}>
          <PrimaryButton
            buttonText="Continue as guest"
            handleClick={handleSignInAnonymousUser}
          />
          <span {...className(textStyles.normalText)}>or</span>
          <span {...className(textStyles.titleText)}>Sign in</span>
          <AuthForm handleSubmit={handleSignIn} primaryButtonText="Sign in" />
          <div {...className(style.redirectCon)}>
            <span {...className(textStyles.normalText)}>
              Don&apos;t have an account yet?
            </span>
            <SecondaryButton buttonText="Sign up" navigateTo="/signup" />
          </div>
          <div {...className(shared.divider)}></div>
          <SecondaryButton
            buttonText="Forgot password?"
            navigateTo="/resetpassword"
          />
        </div>
      </>
    </PageWrapper>
  );
}

export default SignIn;
