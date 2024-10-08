import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { className } from "../../utilities/helpers";
import * as style from "./AccountSettings.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import * as buttons from "../../assets/styles/buttons.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";
import DeleteUserModal from "../../components/modals/DeleteUserModal";
import ChangeEmailModal from "../../components/modals/ChangeEmailModal";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";
import PageWrapper from "../../components/templates/PageWrapper";
import ChangeUsername from "../../components/features/ChangeUsername";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import PrimaryButton from "../../components/buttons/PrimaryButton";

function AccountSettings() {
  const { user } = useContext(AppContext);

  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  return (
    <PageWrapper>
      <>
        <div
          {...className(
            shared.pageContentContainer,
            textStyles.normalText,
            style.settingsContainer
          )}
        >
          <span {...className(textStyles.titleText)}>Account settings</span>
          <div {...className(style.settingsItem)}>
            <span {...className(textStyles.subtitleText)}>Email address</span>
            <div {...className(style.settingsItemContent)}>
              <span>Your current email address: {user?.email}</span>
              <SecondaryButton
                handleClick={() => setIsChangeEmailModalOpen(true)}
                buttonText="Change"
              />
            </div>
          </div>
          <div {...className(style.settingsItem)}>
            <span {...className(textStyles.subtitleText)}>Password</span>
            <div {...className(style.settingsItemContent)}>
              <span>Set a new password</span>
              <SecondaryButton
                handleClick={() => setIsChangePasswordModalOpen(true)}
                buttonText="Change"
              />
            </div>
          </div>
          <div {...className(style.settingsItem)}>
            <ChangeUsername />
          </div>
          <div {...className(shared.divider)} />
          <div {...className(style.settingsItem)}>
            <span {...className(textStyles.subtitleText)}>Delete account</span>
            <span>
              If you delete your account you won&apos;t be able to access your
              notes anymore
            </span>
            <PrimaryButton
              handleClick={() => setIsDeleteUserModalOpen(true)}
              buttonText="Delete account"
              buttonStyle={buttons.buttonDanger}
            />
          </div>
        </div>
        {isDeleteUserModalOpen && (
          <DeleteUserModal
            handleCancel={() => setIsDeleteUserModalOpen(false)}
          />
        )}
        {isChangeEmailModalOpen && (
          <ChangeEmailModal
            handleCancel={() => setIsChangeEmailModalOpen(false)}
          />
        )}
        {isChangePasswordModalOpen && (
          <ChangePasswordModal
            handleCancel={() => setIsChangePasswordModalOpen(false)}
          />
        )}
      </>
    </PageWrapper>
  );
}

export default AccountSettings;
