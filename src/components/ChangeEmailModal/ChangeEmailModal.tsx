import React, { useContext } from "react";
import GeneralInput from "../GeneralInput";
import { AppContext } from "../../context/AppContext";
import ModalContainer from "../ModalContainer";
import { changeEmailSchema } from "../../utilities/validationSchemas";
import { FormikValues } from "formik";
import {
  reauthenticateUser,
  changeUserEmail,
  sendVerificationEmail,
  signOutUser,
} from "../../firestore/authService";
import { FirebaseError } from "firebase/app";
import { evalErrorCode } from "../../utilities/helpers";
import { useNavigate } from "react-router-dom";

type ChangeEmailModalProps = {
  handleCancel: () => void;
};

function ChangeEmailModal({ handleCancel }: ChangeEmailModalProps) {
  const {
    user,
    setToastMessageContent,
    setUser,
    setIsLoading,
    setAuthenticatedUserId,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChangeEmail = async (values: FormikValues) => {
    setIsLoading(true);
    if (user) {
      try {
        const reauthResult = await reauthenticateUser(
          user.email,
          values.password
        );
        if (reauthResult && user.email !== values.newEmail) {
          try {
            await changeUserEmail(values.newEmail);
            try {
              await sendVerificationEmail();
              setUser({ ...user, email: values.newEmail });
              setToastMessageContent({
                actionButtonText: "",
                isPersisting: true,
                showMessage: true,
                isError: false,
                description:
                  "Verification email sent. You will be automatically signed out",
              });
              setTimeout(async () => {
                await signOutUser();
                setUser(null);
                setAuthenticatedUserId(null);
                navigate(0);
              }, 5000);
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
          } catch (error: unknown) {
            console.error("Failed to update email: ", error);
            if (error instanceof FirebaseError) {
              setToastMessageContent({
                actionButtonText: "",
                isPersisting: false,
                showMessage: true,
                isError: true,
                description: `Failed to update email: ${evalErrorCode(
                  error.code
                )}`,
              });
              setIsLoading(false);
            }
          }
        } else {
          setToastMessageContent({
            actionButtonText: "",
            isPersisting: false,
            showMessage: true,
            description: "The new email address can't be the old email address",
            isError: true,
          });
          setIsLoading(false);
        }
      } catch (error: unknown) {
        console.error("Failed to reauthenticate user: ", error);
        if (error instanceof FirebaseError) {
          setToastMessageContent({
            actionButtonText: "",
            isPersisting: false,
            showMessage: true,
            isError: true,
            description: `Failed to authenticate: ${evalErrorCode(error.code)}`,
          });
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <ModalContainer
      title="Set your new email and confirm using your password"
      subtitle={`Your current email: ${user?.email}`}
      handleSubmit={handleChangeEmail}
      handleCancel={handleCancel}
      primaryButtonText="Change email"
      initialFormValues={{ newEmail: "", password: "" }}
      validationSchema={changeEmailSchema}
    >
      <GeneralInput
        type="email"
        config={{ name: "newEmail" }}
        placeholder="New email address"
      />
      <GeneralInput
        type="password"
        config={{ name: "password" }}
        placeholder="Password"
      />
    </ModalContainer>
  );
}

export default ChangeEmailModal;
