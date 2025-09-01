import React, { useContext } from "react";
import GeneralInput from "../../inputs/GeneralInput";
import ModalContainer from "../../templates/ModalContainer";
import { changePasswordSchema } from "../../../utilities/validationSchemas";
import { FormikValues } from "formik";
import {
  reauthenticateUser,
  changeUserPassword,
} from "../../../firebase/authService";
import { AppContext } from "../../../context/AppContext";
import { FirebaseError } from "firebase/app";
import { evalErrorCode } from "../../../utilities/helpers";

type ChangePasswordModalProps = {
  handleCancel: () => void;
};

function ChangePasswordModal({ handleCancel }: ChangePasswordModalProps) {
  const { user, setToastMessageContent, setIsLoading } = useContext(AppContext);

  if (!user) {
    return null;
  }

  const handleChangePassword = async (values: FormikValues) => {
    setIsLoading(true);

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
        config={{ name: "oldPassword" }}
        placeholder="Old password"
      />
      <GeneralInput
        type="password"
        config={{ name: "newPassword" }}
        placeholder="New password"
      />
    </ModalContainer>
  );
}

export default ChangePasswordModal;
