import React, { useContext } from "react";
import GeneralInput from "../../inputs/GeneralInput";
import ModalContainer from "../../templates/ModalContainer";
import { FormikValues } from "formik";
import { deleteUserSchema } from "../../../utilities/validationSchemas";
import { deleteUserDataInDb } from "../../../services/userService";
import {
  reauthenticateUser,
  deleteUserAccount,
  signOutUser,
} from "../../../firebase/authService";
import { AppContext } from "../../../context/AppContext";
import { FirebaseError } from "firebase/app";
import { evalErrorCode } from "../../../utilities/helpers";
import { useNavigate, useSearchParams } from "react-router-dom";

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

  const handleDeleteUser = async (values: FormikValues) => {
    setIsLoading(true);

    try {
      const reauthResult = await reauthenticateUser(
        user.email,
        values.password
      );
      if (reauthResult) {
        try {
          //delete user account
          await deleteUserAccount();
          //delete user data
          await deleteUserDataInDb();
          setUser(null);
          setAuthenticatedUser(null);
          await signOutUser();
          navigate("/signin");
          setSearchParams({
            deleteAccountSuccess: "true",
          });
        } catch (error) {
          console.error("Error while deleting user account: ", error);
          setToastMessageContent({
            actionButtonText: "",
            isPersisting: false,
            showMessage: true,
            isError: true,
            description: `Internal error while deleting user account`,
          });
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
