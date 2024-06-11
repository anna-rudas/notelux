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
import InformationMessage from "../components/InformationMessage";
import { Formik, Form, FormikValues } from "formik";
import { settingsSchema } from "../validationSchemas";

function AccountSettings() {
  const { user, infoMessage, setInfoMessage, setUser, setIsLoading } =
    useContext(AppContext);

  const [isDelConfOpen, setIsDelConfOpen] = useState(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();

  const handleDeleteUser = async (values: FormikValues) => {
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
            await deleteUser(auth.currentUser);
            navigate(0);
          } catch (error: unknown) {
            if (error instanceof FirebaseError) {
              console.error("Failed to delete user: ", error.code);
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          console.error("Failed to reauthenticate user: ", error.code);
        }
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
          isPersisting: false,
          showMsg: true,
          isError: false,
          desc: "Verification email sent. You will be automatically signed out in 3 seconds",
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
            sendVerifyEmail();
            if (user) {
              setUser({ ...user, email: values.newEmail });
            }
            setTimeout(() => {
              signOutUser();
            }, 3000);
          } catch (error: unknown) {
            if (error instanceof FirebaseError) {
              console.error("Failed to update email: ", error.code);
              setInfoMessage({
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
            isPersisting: false,
            showMsg: true,
            isError: true,
            desc: `Failed to authenticate: ${evalErrorCode(error.code)}`,
          });
        }
        setIsLoading(false);
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
              isPersisting: false,
              showMsg: true,
              isError: false,
              desc: "Password successfully updated",
            });
            setIsLoading(false);
            setIsChangePasswordOpen(false);
          } catch (error: unknown) {
            if (error instanceof FirebaseError) {
              console.error("Failed to update password: ", error.code);
              setInfoMessage({
                isPersisting: false,
                showMsg: true,
                isError: true,
                desc: `Failed to update password: ${evalErrorCode(error.code)}`,
              });
              setIsLoading(false);
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          console.error("Failed to reauthenticate user: ", error.code);
          setInfoMessage({
            isPersisting: false,
            showMsg: true,
            isError: true,
            desc: `Failed to authenticate: ${evalErrorCode(error.code)}`,
          });
        }
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
      ...infoMessage,
      isPersisting: false,
      showMsg: true,
    });
  };

  return (
    <PageWrapper isAuthStlye={true}>
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
                {...className(style.settingsItemCon, style.settingsItemConName)}
              >
                <GeneralInput
                  type="username"
                  config={{ name: "username" }}
                  placeholder="Username"
                />
                <button
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
        {infoMessage.showMsg && (
          <InformationMessage
            description={infoMessage.desc}
            isError={infoMessage.isError}
          />
        )}
      </>
    </PageWrapper>
  );
}

export default AccountSettings;
