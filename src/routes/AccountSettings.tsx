import React, { useContext, useState } from "react";
import Header from "../components/Header";
import { defaultTheme } from "../constants";
import { AppContext } from "../context";
import AccountDropdown from "../components/AccountDropdown";
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

import InformationMessage from "../components/InformationMessage";

import ChangeEmailConfirmation from "../components/ChangeEmailConfirmation";
import ChangePasswordConfirmation from "../components/ChangePasswordConfirmation";

function AccountSettings() {
  const {
    user,
    isDropdownOpen,
    isLoading,
    password,

    infoMessage,
    setInfoMessage,
    email,
    setUser,
    setIsLoading,
  } = useContext(AppContext);

  const [isDelConfOpen, setIsDelConfOpen] = useState(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState(user?.username);
  const navigate = useNavigate();

  const auth = getAuth();

  const handleDeleteUser = async () => {
    if (auth.currentUser && auth.currentUser.email) {
      const currentEmail = auth.currentUser.email;
      const credential = EmailAuthProvider.credential(currentEmail, password);
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
              console.error(error.code);
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          console.error(error.code);
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
        console.error(error.code);
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
      if (error) {
        console.error(error);
      }
    }
  };

  const handleChangeEmail = async () => {
    setIsLoading(true);

    if (auth.currentUser && auth.currentUser.email) {
      const currentEmail = auth.currentUser.email;
      const credential = EmailAuthProvider.credential(currentEmail, password);
      try {
        const reAuthResult = await reauthenticateWithCredential(
          auth.currentUser,
          credential
        );
        if (reAuthResult && auth.currentUser.email !== email) {
          try {
            await updateEmail(auth.currentUser, email);
            sendVerifyEmail();
            if (user) {
              setUser({ ...user, email: email });
            }
            setTimeout(() => {
              signOutUser();
            }, 3000);
          } catch (error: unknown) {
            if (error instanceof FirebaseError) {
              console.error(error.code);
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
          console.error(error.code);
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

  const handleChangePassword = async () => {
    setIsLoading(true);
    if (auth.currentUser && auth.currentUser.email) {
      const currentEmail = auth.currentUser.email;
      const currentPassword = password;
      const credential = EmailAuthProvider.credential(
        currentEmail,
        currentPassword
      );
      try {
        const reAuthResult = await reauthenticateWithCredential(
          auth.currentUser,
          credential
        );
        if (reAuthResult) {
          try {
            await updatePassword(auth.currentUser, newPassword);
            setInfoMessage({
              isPersisting: false,
              showMsg: true,
              isError: false,
              desc: "Password successfully updated",
            });
            setIsLoading(false);
          } catch (error: unknown) {
            if (error instanceof FirebaseError) {
              console.error(error.code);
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
          console.error(error.code);
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

  const handleNameChange = () => {
    setIsLoading(true);
    if (name && user) {
      setUser({ ...user, username: name });
    }
    setIsLoading(false);
    setInfoMessage({
      ...infoMessage,
      isPersisting: false,
      showMsg: true,
    });
  };

  return (
    <div className="wrapper" data-theme={user?.theme ?? defaultTheme}>
      {isLoading && <div {...className(shared.loadingModal)}></div>}
      <Header loggedInStyle={true} />
      {isDropdownOpen && <AccountDropdown />}
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
          <div {...className(style.settingsItemCon, style.settingsItemConName)}>
            <GeneralInput
              setInputValue={setName}
              placeholder="Name"
              inputValue={name}
              isDisabled={isLoading}
            />
            <button
              onClick={handleNameChange}
              {...className(shared.btn, shared.buttonPrimary)}
            >
              Save changes
            </button>
          </div>
        </div>
        <div {...className(shared.divider)} />
        <div {...className(style.settingsItem)}>
          <span {...className(shared.secondaryTitleText)}>Delete account</span>
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
          handleDelete={handleDeleteUser}
          setIsDelConfOpen={setIsDelConfOpen}
        />
      )}

      {infoMessage.showMsg && (
        <InformationMessage
          description={infoMessage.desc}
          isError={infoMessage.isError}
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
          setNewItem={setNewPassword}
        />
      )}
    </div>
  );
}

export default AccountSettings;
