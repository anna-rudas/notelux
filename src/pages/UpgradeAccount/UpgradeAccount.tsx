import React, { useContext } from "react";
import * as style from "./UpgradeAccount.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";
import { className, evalErrorCode } from "../../utilities/helpers";
import { AppContext } from "../../context/AppContext";
import { FirebaseError } from "firebase/app";
import AuthForm from "../../components/templates/AuthForm";
import PageWrapper from "../../components/templates/PageWrapper";
import { FormikValues } from "formik";
import {
  sendVerificationEmail,
  upgradeUserAccountToPermanent,
} from "../../firestore/authService";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateUserInDb } from "../../firestore/userService";

function UpgradeAccount() {
  const { setIsLoading, setToastMessageContent, user } = useContext(AppContext);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const handleUpgradeAccount = async (values: FormikValues) => {
    setIsLoading(true);

    try {
      const upgradeResult = await upgradeUserAccountToPermanent(
        values.email,
        values.password
      );
      if (upgradeResult && user) {
        try {
          await sendVerificationEmail();

          try {
            await updateUserInDb({
              ...user,
              email: values.email,
              username: values.username,
            });
            navigate("/signin");
            setSearchParams({ upgradeAccountSuccess: "true" });
            navigate(0);
          } catch (error: unknown) {
            console.error("Failed to update user in database: ", error);
            if (error instanceof FirebaseError) {
              setToastMessageContent({
                actionButtonText: "",
                isPersisting: false,
                showMessage: true,
                isError: true,
                description: `Failed to update user in database: ${evalErrorCode(
                  error.code
                )}`,
              });
            }
            setIsLoading(false);
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
          setIsLoading(false);
        }
      }
    } catch (error: unknown) {
      console.error("Failed to upgrade account: ", error);
      if (error instanceof FirebaseError) {
        setToastMessageContent({
          actionButtonText: "",
          isPersisting: false,
          showMessage: true,
          isError: true,
          description: `Failed to upgrade account: ${evalErrorCode(
            error.code
          )}`,
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper useUnauthenticatedStyle={true}>
      <>
        <div
          {...className(
            shared.pageContentContainer,
            style.pageContentContainer
          )}
        >
          <span {...className(textStyles.titleText)}>Upgrade your account</span>
          <span {...className(textStyles.normalText, textStyles.centerText)}>
            By creating a permanent account you will be able to share your notes
            and access them anywhere, anytime.
          </span>
          <AuthForm
            handleSubmit={handleUpgradeAccount}
            primaryButtonText="Upgrade account"
            showUsername={true}
          />
          <div {...className(style.redirectCon)}>
            <SecondaryButton buttonText="Go back" navigateTo="/dashboard" />
          </div>
        </div>
      </>
    </PageWrapper>
  );
}

export default UpgradeAccount;
