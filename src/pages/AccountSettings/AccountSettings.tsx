import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { className, evalErrorCode } from "../../utilities/helpers";
import * as style from "./AccountSettings.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import * as sharedPages from "../../assets/styles/sharedPages.module.css";
import DeleteUserConfirmation from "../../components/DeleteUserConfirmation";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import GeneralInput from "../../components/GeneralInput";
import ChangeEmailConfirmation from "../../components/ChangeEmailConfirmation";
import ChangePasswordConfirmation from "../../components/ChangePasswordConfirmation";
import PageWrapper from "../../components/PageWrapper";
import { Formik, Form, FormikValues } from "formik";
import { settingsSchema } from "../../utilities/validationSchemas";
import { deleteUserDataInDb } from "../../firestore/userService";
import {
  reauthenticateUser,
  deleteUserAccount,
  changeUserPassword,
  changeUserEmail,
  sendVerificationEmail,
  signOutUser,
} from "../../firestore/authService";

function AccountSettings() {
  const { user, setInfoMessage, setUser, setIsLoading, isLoading, setUserId } =
    useContext(AppContext);

  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
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
            setInfoMessage({
              actionButtonText: "",
              isPersisting: true,
              showMsg: true,
              isError: false,
              desc: "User deletion successful. You will be automatically signed out",
            });
            setTimeout(() => {
              navigate(0);
            }, 5000);
          } catch (error) {
            console.error("Failed to delete user: ", error);
            if (error instanceof FirebaseError) {
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
      } catch (error: unknown) {
        console.error("Failed to reauthenticate user: ", error);
        if (error instanceof FirebaseError) {
          setInfoMessage({
            actionButtonText: "",
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
              setInfoMessage({
                actionButtonText: "",
                isPersisting: true,
                showMsg: true,
                isError: false,
                desc: "Verification email sent. You will be automatically signed out",
              });
              setTimeout(async () => {
                await signOutUser();
                setUser(null);
                setUserId(null);
                navigate(0);
              }, 5000);
            } catch (error: unknown) {
              console.error("Failed to send verification email: ", error);
              if (error instanceof FirebaseError) {
                setInfoMessage({
                  actionButtonText: "",
                  isPersisting: false,
                  showMsg: true,
                  isError: true,
                  desc: `Failed to send verification email: ${evalErrorCode(
                    error.code
                  )}`,
                });
              }
              setIsLoading(false);
            }
          } catch (error: unknown) {
            console.error("Failed to update email: ", error);
            if (error instanceof FirebaseError) {
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
        console.error("Failed to reauthenticate user: ", error);
        if (error instanceof FirebaseError) {
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
    if (user) {
      try {
        const reauthResult = await reauthenticateUser(
          user.email,
          values.oldPassword
        );
        if (reauthResult) {
          try {
            await changeUserPassword(values.newPassword);
            setInfoMessage({
              actionButtonText: "",
              isPersisting: false,
              showMsg: true,
              isError: false,
              desc: "Password successfully updated",
            });
          } catch (error: unknown) {
            console.error("Failed to update password: ", error);
            if (error instanceof FirebaseError) {
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
        console.error("Failed to reauthenticate user: ", error);
        if (error instanceof FirebaseError) {
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

  const handleChangeUsername = (values: FormikValues) => {
    setIsLoading(true);
    if (user) {
      setUser({ ...user, username: values.username });
    }
    setInfoMessage({
      showMsg: true,
      actionButtonText: "",
      isPersisting: false,
      isError: false,
      desc: "Username updated successfully",
    });
    setIsLoading(false);
  };

  return (
    <PageWrapper>
      <>
        <div
          {...className(
            sharedPages.contentCon,
            shared.normalText,
            style.settingsCon
          )}
        >
          <span {...className(shared.titleText)}>Account settings</span>
          <div {...className(sharedPages.settingsItem)}>
            <span {...className(shared.secondaryTitleText)}>Email address</span>
            <div {...className(sharedPages.settingsItemCon)}>
              <span>Your current email address: {user?.email}</span>
              <button
                disabled={isLoading}
                onClick={() => {
                  setIsChangeEmailModalOpen(true);
                }}
                {...className(
                  shared.btn,
                  shared.buttonSecondary,
                  isLoading ? shared.btnDisabled : ""
                )}
              >
                Change
              </button>
            </div>
          </div>
          <div {...className(sharedPages.settingsItem)}>
            <span {...className(shared.secondaryTitleText)}>Password</span>
            <div {...className(sharedPages.settingsItemCon)}>
              <span>Set a new password</span>
              <button
                disabled={isLoading}
                onClick={() => {
                  setIsChangePasswordModalOpen(true);
                }}
                {...className(
                  shared.btn,
                  shared.buttonSecondary,
                  isLoading ? shared.btnDisabled : ""
                )}
              >
                Change
              </button>
            </div>
          </div>
          <div {...className(sharedPages.settingsItem)}>
            <span {...className(shared.secondaryTitleText)}>Name</span>
            <span>Set what name to display in the menu</span>
            <Formik
              initialValues={{ username: user?.username }}
              validationSchema={settingsSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleChangeUsername(values);
                setSubmitting(false);
              }}
            >
              <Form
                noValidate
                {...className(
                  sharedPages.settingsItemCon,
                  sharedPages.settingsItemConName
                )}
              >
                <GeneralInput
                  type="username"
                  config={{ name: "username" }}
                  placeholder="Username"
                />
                <button
                  disabled={isLoading}
                  type="submit"
                  {...className(
                    shared.btn,
                    shared.buttonPrimary,
                    isLoading ? shared.btnDisabled : ""
                  )}
                >
                  Save changes
                </button>
              </Form>
            </Formik>
          </div>
          <div {...className(shared.divider)} />
          <div {...className(sharedPages.settingsItem)}>
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
                setIsDeleteConfirmationModalOpen(true);
              }}
              {...className(
                shared.btn,
                shared.buttonDanger,
                isLoading ? shared.btnDisabled : ""
              )}
            >
              Delete account
            </button>
          </div>
        </div>
        {isDeleteConfirmationModalOpen && (
          <DeleteUserConfirmation
            handleSubmit={handleDeleteUser}
            handleCancel={() => setIsDeleteConfirmationModalOpen(false)}
          />
        )}
        {isChangeEmailModalOpen && (
          <ChangeEmailConfirmation
            handleSubmit={handleChangeEmail}
            handleCancel={() => setIsChangeEmailModalOpen(false)}
          />
        )}
        {isChangePasswordModalOpen && (
          <ChangePasswordConfirmation
            handleSubmit={handleChangePassword}
            handleCancel={() => setIsChangePasswordModalOpen(false)}
          />
        )}
      </>
    </PageWrapper>
  );
}

export default AccountSettings;
