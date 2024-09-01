import React, { useContext } from "react";
import GeneralInput from "../../inputs/GeneralInput";
import { AppContext } from "../../../context/AppContext";
import ModalContainer from "../../templates/ModalContainer";
import { changeEmailSchema } from "../../../utilities/validationSchemas";
import { FormikValues } from "formik";
import {
  reauthenticateUser,
  changeUserEmail,
  sendVerificationEmail,
} from "../../../firestore/authService";
import { FirebaseError } from "firebase/app";
import { evalErrorCode } from "../../../utilities/helpers";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateUserInDb } from "../../../firestore/userService";

type ChangeEmailModalProps = {
  handleCancel: () => void;
};

function ChangeEmailModal({ handleCancel }: ChangeEmailModalProps) {
  const { user, setToastMessageContent, setIsLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

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
              try {
                await updateUserInDb({ ...user, email: values.newEmail });
                navigate("/signin");
                setSearchParams({ changeEmailSuccess: "true" });
                navigate(0);
              } catch (error) {
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
