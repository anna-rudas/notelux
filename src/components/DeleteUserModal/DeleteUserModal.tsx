import React, { useContext } from "react";
import GeneralInput from "../GeneralInput";
import ModalContainer from "../ModalContainer";
import { FormikValues } from "formik";
import { deleteUserSchema } from "../../utilities/validationSchemas";
import { deleteUserDataInDb } from "../../firestore/userService";
import {
  reauthenticateUser,
  deleteUserAccount,
} from "../../firestore/authService";
import { AppContext } from "../../context/AppContext";
import { FirebaseError } from "firebase/app";
import { evalErrorCode } from "../../utilities/helpers";
import { useNavigate } from "react-router-dom";

type DeleteUserModalProps = {
  handleCancel: () => void;
};

function DeleteUserModal({ handleCancel }: DeleteUserModalProps) {
  const { user, setToastMessageContent, setIsLoading } = useContext(AppContext);
  const navigate = useNavigate();

  const handleDeleteUser = async (values: FormikValues) => {
    setIsLoading(true);
    if (user) {
      try {
        const reauthResult = await reauthenticateUser(
          user.email,
          values.password
        );
        if (reauthResult) {
          try {
            //delete user data
            await deleteUserDataInDb(user.id);
            //delete user account
            await deleteUserAccount();
            setToastMessageContent({
              actionButtonText: "",
              isPersisting: true,
              showMessage: true,
              isError: false,
              description:
                "User deletion successful. You will be automatically signed out",
            });
            setTimeout(() => {
              navigate(0);
            }, 5000);
          } catch (error) {
            console.error("Failed to delete user: ", error);
            if (error instanceof FirebaseError) {
              setToastMessageContent({
                actionButtonText: "",
                isPersisting: false,
                showMessage: true,
                isError: true,
                description: `Failed to delete user: ${evalErrorCode(
                  error.code
                )}`,
              });
            }
            setIsLoading(false);
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
        setIsLoading(false);
      }
    }
  };

  return (
    <ModalContainer
      title="Are you sure you want to delete your account?"
      subtitle="Please confirm using your password"
      handleSubmit={handleDeleteUser}
      handleCancel={handleCancel}
      primaryButtonText="Delete account"
      initialFormValues={{ password: "" }}
      validationSchema={deleteUserSchema}
    >
      <GeneralInput
        type="password"
        config={{ name: "password" }}
        placeholder="Password"
      />
    </ModalContainer>
  );
}

export default DeleteUserModal;
