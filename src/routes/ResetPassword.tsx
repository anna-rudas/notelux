import React, { useContext } from "react";
import GeneralInput from "../components/GeneralInput";
import { AppContext } from "../context";
import { className, evalErrorCode } from "../helpers";
import * as style from "./Routes.module.css";
import * as shared from "../components/shared.module.css";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import InformationMessage from "../components/InformationMessage";

function ResetPassword() {
  const {
    email,
    setEmail,
    setInfoMessage,
    isLoading,
    setIsLoading,
    infoMessage,
  } = useContext(AppContext);

  const auth = getAuth();

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setInfoMessage({
        isPersisting: false,
        showMsg: true,
        isError: false,
        desc: "Email sent",
      });
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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <PageWrapper isAuthStlye={false}>
      <>
        <div {...className(style.contentCon)}>
          <span {...className(shared.titleText)}>Reset your password</span>
          <span>
            Enter your email address and we will send instructions on how to
            reset your password
          </span>
          <GeneralInput setInputValue={setEmail} placeholder="Email address" />
          <div {...className(style.redirectCon)}>
            <button
              disabled={isLoading}
              onClick={handleResetPassword}
              {...className(
                shared.btn,
                shared.buttonPrimary,
                isLoading ? shared.btnDisabled : ""
              )}
            >
              Reset password
            </button>
            <Link
              to="/signin"
              {...className(
                shared.btn,
                shared.buttonSecondary,
                isLoading && shared.disabledLink
              )}
            >
              Go back
            </Link>
          </div>
        </div>
        {infoMessage.showMsg && (
          <InformationMessage
            description={infoMessage.desc}
            isError={infoMessage.isError}
          />
        )}
      </>
    </PageWrapper>
  );
}

export default ResetPassword;
