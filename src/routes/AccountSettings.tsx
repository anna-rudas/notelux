import React, { useContext, useState } from "react";
import { AppContext } from "../context";
import { className, evalErrorCode } from "../helpers";
import * as style from "./Routes.module.css";
import * as shared from "../components/shared.module.css";
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  sendEmailVerification,
  signOut,
  updatePassword,
} from "firebase/auth";
import DeleteUserConfirmation from "../components/DeleteUserConfirmation";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import GeneralInput from "../components/GeneralInput";
import ChangeEmailConfirmation from "../components/ChangeEmailConfirmation";
import ChangePasswordConfirmation from "../components/ChangePasswordConfirmation";
import PageWrapper from "../components/PageWrapper";
import { Formik, Form, FormikValues } from "formik";
import { settingsSchema } from "../validationSchemas";

function AccountSettings() {
  const {
    user,
    infoMessage,
    setInfoMessage,
    setUser,
    setIsLoading,
    isLoading,
    deleteUserDataInDb,
    setUserId,
  } = useContext(AppContext);

  const [isDelConfOpen, setIsDelConfOpen] = useState(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();

  const handleDeleteUser = async (values: FormikValues) => {
    setIsLoading(true);
    if (auth.currentUser && auth.currentUser.email) {
      const currentEmail = auth.currentUser.email;
      const credential = EmailAuthProvider.credential(
        currentEmail,
        values.password
      );
      try {
        const reAuthResult = await reauthenticateWithCredential(
          auth.currentUser,
          credential
        );
        if (reAuthResult) {
          try {
            //delete data
            await deleteUserDataInDb(auth.currentUser.uid);
            //delete user
            await deleteUser(auth.currentUser);
            setInfoMessage({
              actionButtonText: "",
              isPersisting: false,
              showMsg: true,
              isError: false,
              desc: "User deletion successful. You will be automatically signed out",
            });

            setTimeout(() => {
              navigate(0);
            }, 5000);
          } catch (error: unknown) {
            if (error instanceof FirebaseError) {
              console.error("Failed to delete user: ", error.code);
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          console.error("Failed to reauthenticate user: ", error.code);
          setInfoMessage({
            actionButtonText: "",
            isPersisting: false,
            showMsg: true,
            isError: true,
            desc: `Failed to delete user: ${evalErrorCode(error.code)}`,
          });
        }
        setIsLoading(false);
      }
    }
  };

  const sendVerifyEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, {
          url: "http://localhost:1234/signin",
        });
        setInfoMessage({
          actionButtonText: "",
          isPersisting: false,
          showMsg: true,
          isError: false,
          desc: "Verification email sent. You will be automatically signed out",
        });
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to send verification email: ", error.code);
        setInfoMessage({
          ...infoMessage,
          showMsg: true,
          isError: true,
          desc: `Failed to send verification email: ${evalErrorCode(
            error.code
          )}`,
        });
      }
      setIsLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserId(null);
      navigate(0);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to sign out user: ", error.code);
      }
    }
  };

  const handleChangeEmail = async (values: FormikValues) => {
    setIsLoading(true);

    if (auth.currentUser && auth.currentUser.email) {
      const currentEmail = auth.currentUser.email;
      const credential = EmailAuthProvider.credential(
        currentEmail,
        values.password
      );
      try {
        const reAuthResult = await reauthenticateWithCredential(
          auth.currentUser,
          credential
        );
        if (reAuthResult && auth.currentUser.email !== values.newEmail) {
          try {
            await updateEmail(auth.currentUser, values.newEmail);
            await sendVerifyEmail();
            if (user) {
              setUser({ ...user, email: values.newEmail });
            }
            setTimeout(() => {
              signOutUser();
            }, 5000);
          } catch (error: unknown) {
            if (error instanceof FirebaseError) {
              console.error("Failed to update email: ", error.code);
              setInfoMessage({
                actionButtonText: "",
                isPersisting: false,
                showMsg: true,
                isError: true,
                desc: `Failed to update email: ${evalErrorCode(error.code)}`,
              });
              setIsLoading(false);
            }
          }
        } else {
          setInfoMessage({
            actionButtonText: "",
            isPersisting: false,
            showMsg: true,
            desc: "The new email address can't be the old email address",
            isError: true,
          });
          setIsLoading(false);
        }
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          console.error("Failed to reauthenticate user: ", error.code);
          setInfoMessage({
            actionButtonText: "",
            isPersisting: false,
            showMsg: true,
            isError: true,
            desc: `Failed to authenticate: ${evalErrorCode(error.code)}`,
          });
          setIsLoading(false);
        }
      }
    }
  };

  const handleChangePassword = async (values: FormikValues) => {
    setIsLoading(true);
    if (auth.currentUser && auth.currentUser.email) {
      const currentEmail = auth.currentUser.email;
      const credential = EmailAuthProvider.credential(
        currentEmail,
        values.oldPassword
      );
      try {
        const reAuthResult = await reauthenticateWithCredential(
          auth.currentUser,
          credential
        );
        if (reAuthResult) {
          try {
            await updatePassword(auth.currentUser, values.newPassword);
            setInfoMessage({
              actionButtonText: "",
              isPersisting: false,
              showMsg: true,
              isError: false,
              desc: "Password successfully updated",
            });
            setIsChangePasswordOpen(false);
          } catch (error: unknown) {
            if (error instanceof FirebaseError) {
              console.error("Failed to update password: ", error.code);
              setInfoMessage({
                actionButtonText: "",
                isPersisting: false,
                showMsg: true,
                isError: true,
                desc: `Failed to update password: ${evalErrorCode(error.code)}`,
              });
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          console.error("Failed to reauthenticate user: ", error.code);
          setInfoMessage({
            actionButtonText: "",
            isPersisting: false,
            showMsg: true,
            isError: true,
            desc: `Failed to authenticate: ${evalErrorCode(error.code)}`,
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNameChange = (values: FormikValues) => {
    setIsLoading(true);
    if (user) {
      setUser({ ...user, username: values.username });
    }
    setIsLoading(false);
    setInfoMessage({
      showMsg: true,
      actionButtonText: "",
      isPersisting: false,
      isError: false,
      desc: "Username updated successfully",
    });
  };

  return (
    <PageWrapper isAuthStyle={true}>
      <>
        <div
          {...className(style.contentCon, shared.normalText, style.settingsCon)}
        >
          <span {...className(shared.titleText)}>Account settings</span>
          <div {...className(style.settingsItem)}>
            <span {...className(shared.secondaryTitleText)}>Email address</span>
            <div {...className(style.settingsItemCon)}>
              <span>Your current email address: {user?.email}</span>
              <button
                disabled={isLoading}
                onClick={() => {
                  setIsChangeEmailOpen(true);
                }}
                {...className(shared.btn, shared.buttonSecondary)}
              >
                Change
              </button>
            </div>
          </div>
          <div {...className(style.settingsItem)}>
            <span {...className(shared.secondaryTitleText)}>Password</span>
            <div {...className(style.settingsItemCon)}>
              <span>Set a new password</span>
              <button
                disabled={isLoading}
                onClick={() => {
                  setIsChangePasswordOpen(true);
                }}
                {...className(shared.btn, shared.buttonSecondary)}
              >
                Change
              </button>
            </div>
          </div>
          <div {...className(style.settingsItem)}>
            <span {...className(shared.secondaryTitleText)}>Name</span>
            <span>Set what name to display in the menu</span>
            <Formik
              initialValues={{ username: user?.username }}
              validationSchema={settingsSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleNameChange(values);
                setSubmitting(false);
              }}
            >
              <Form
                noValidate
                {...className(style.settingsItemCon, style.settingsItemConName)}
              >
                <GeneralInput
                  type="username"
                  config={{ name: "username" }}
                  placeholder="Username"
                />
                <button
                  disabled={isLoading}
                  type="submit"
                  {...className(shared.btn, shared.buttonPrimary)}
                >
                  Save changes
                </button>
              </Form>
            </Formik>
          </div>
          <div {...className(shared.divider)} />
          <div {...className(style.settingsItem)}>
            <span {...className(shared.secondaryTitleText)}>
              Delete account
            </span>
            <span>
              If you delete your account you won&apos;t be able to access your
              notes anymore
            </span>
            <button
              disabled={isLoading}
              onClick={() => {
                setIsDelConfOpen(true);
              }}
              {...className(shared.btn, shared.buttonDanger)}
            >
              Delete account
            </button>
          </div>
        </div>
        {isDelConfOpen && (
          <DeleteUserConfirmation
            handleSubmit={handleDeleteUser}
            setIsModalOpen={setIsDelConfOpen}
          />
        )}
        {isChangeEmailOpen && (
          <ChangeEmailConfirmation
            handleSubmit={handleChangeEmail}
            setIsModalOpen={setIsChangeEmailOpen}
          />
        )}
        {isChangePasswordOpen && (
          <ChangePasswordConfirmation
            handleSubmit={handleChangePassword}
            setIsModalOpen={setIsChangePasswordOpen}
          />
        )}
      </>
    </PageWrapper>
  );
}

export default AccountSettings;
