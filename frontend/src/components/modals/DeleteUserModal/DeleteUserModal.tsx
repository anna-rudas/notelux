import React, { useContext } from "react";
import GeneralInput from "../../inputs/GeneralInput";
import ModalContainer from "../../templates/ModalContainer";
import { FormikValues } from "formik";
import { deleteUserSchema } from "../../../utilities/validationSchemas";
import { addUserInDb, deleteUserDataInDb } from "../../../services/userService";
import {
  reauthenticateUser,
  deleteUserAccount,
  signOutUser,
} from "../../../firestore/authService";
import { AppContext } from "../../../context/AppContext";
import { FirebaseError } from "firebase/app";
import { evalErrorCode } from "../../../utilities/helpers";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User } from "../../../types/types";

type DeleteUserModalProps = {
  handleCancel: () => void;
};

function DeleteUserModal({ handleCancel }: DeleteUserModalProps) {
  const {
    user,
    setToastMessageContent,
    setIsLoading,
    setUser,
    setAuthenticatedUser,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  if (!user) {
    return null;
  }

  const reAddUserData = async (userData: User) => {
    try {
      await addUserInDb(userData);
    } catch (error: unknown) {
      console.error("Failed to readd user: ", error);
    }
  };

  const handleDeleteUser = async (values: FormikValues) => {
    setIsLoading(true);
    const userData = { ...user };

    try {
      const reauthResult = await reauthenticateUser(
        user.email,
        values.password
      );
      if (reauthResult) {
        try {
          //delete user data
          await deleteUserDataInDb(user.userId);
          setUser(null);
          setAuthenticatedUser(null);
          setIsLoading(true);
          try {
            //delete user account
            await deleteUserAccount();
            await signOutUser();
            navigate("/signin");
            setSearchParams({
              deleteAccountSuccess: "true",
            });
            setIsLoading(false);
          } catch (error) {
            reAddUserData(userData);
            console.error("Failed to delete user account: ", error);
            if (error instanceof FirebaseError) {
              setToastMessageContent({
                actionButtonText: "",
                isPersisting: false,
                showMessage: true,
                isError: true,
                description: `Failed to delete user account: ${evalErrorCode(
                  error.code
                )}`,
              });
            }
            setIsLoading(false);
          }
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
