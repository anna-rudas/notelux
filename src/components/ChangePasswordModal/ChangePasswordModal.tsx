import React, { useContext } from "react";
import GeneralInput from "../GeneralInput";
import ModalContainer from "../ModalContainer";
import { changePasswordSchema } from "../../utilities/validationSchemas";
import { FormikValues } from "formik";
import {
  reauthenticateUser,
  changeUserPassword,
} from "../../firestore/authService";
import { AppContext } from "../../context/AppContext";
import { FirebaseError } from "firebase/app";
import { evalErrorCode } from "../../utilities/helpers";

type ChangePasswordModalProps = {
  handleCancel: () => void;
};

function ChangePasswordModal({ handleCancel }: ChangePasswordModalProps) {
  const { user, setToastMessageContent, setIsLoading } = useContext(AppContext);

  const handleChangePassword = async (values: FormikValues) => {
    setIsLoading(true);
    if (user) {
      try {
        const reauthResult = await reauthenticateUser(
          user.email,
          values.oldPassword
        );
        if (reauthResult) {
          try {
            await changeUserPassword(values.newPassword);
            setToastMessageContent({
              actionButtonText: "",
              isPersisting: false,
              showMessage: true,
              isError: false,
              description: "Password successfully updated",
            });
          } catch (error: unknown) {
            console.error("Failed to update password: ", error);
            if (error instanceof FirebaseError) {
              setToastMessageContent({
                actionButtonText: "",
                isPersisting: false,
                showMessage: true,
                isError: true,
                description: `Failed to update password: ${evalErrorCode(
                  error.code
                )}`,
              });
            }
          }
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
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ModalContainer
      title="Set your new password"
      subtitle="Confirm using your old password"
      handleSubmit={handleChangePassword}
      handleCancel={handleCancel}
      primaryButtonText="Change password"
      initialFormValues={{ newPassword: "", oldPassword: "" }}
      validationSchema={changePasswordSchema}
    >
      <GeneralInput
        type="password"
        config={{ name: "newPassword" }}
        placeholder="New password"
      />
      <GeneralInput
        type="password"
        config={{ name: "oldPassword" }}
        placeholder="Old password"
      />
    </ModalContainer>
  );
}

export default ChangePasswordModal;
