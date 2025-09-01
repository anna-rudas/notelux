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
  signOutUser,
} from "../../../firebase/authService";
import { FirebaseError } from "firebase/app";
import { evalErrorCode } from "../../../utilities/helpers";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateUserInDb } from "../../../services/userService";
import { useErrorBoundary } from "react-error-boundary";

type ChangeEmailModalProps = {
  handleCancel: () => void;
};

function ChangeEmailModal({ handleCancel }: ChangeEmailModalProps) {
  const {
    user,
    setToastMessageContent,
    setIsLoading,
    setUser,
    setAuthenticatedUser,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const { showBoundary } = useErrorBoundary();

  if (!user) {
    return null;
  }

  const handleChangeEmail = async (values: FormikValues) => {
    setIsLoading(true);
    const userData = { ...user };

    try {
      const reauthResult = await reauthenticateUser(
        userData.email,
        values.password
      );
      if (reauthResult && userData.email !== values.newEmail) {
        try {
          setUser(null);
          setAuthenticatedUser(null);
          await changeUserEmail(values.newEmail);
          await sendVerificationEmail();
          await updateUserInDb({
            ...userData,
            email: values.newEmail,
          });
          try {
            await signOutUser();
            navigate("/signin");
            setSearchParams({ changeEmailSuccess: "true" });
          } catch (error: unknown) {
            console.error("Failed to sign out user: ", error);
            showBoundary(error);
          }
        } catch (error: unknown) {
          console.error("Error while updating email: ", error);
          setToastMessageContent({
            actionButtonText: "",
            isPersisting: false,
            showMessage: true,
            isError: true,
            description: `Internal error while updating email`,
          });
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
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalContainer
      title="Set your new email and confirm using your password"
      subtitle={`Your current email: ${user.email}`}
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
