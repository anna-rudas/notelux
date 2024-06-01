import React, { useContext } from "react";
import Header from "../components/Header";
import { defaultTheme } from "../constants";
import { AppContext } from "../context";
import AccountDropdown from "../components/AccountDropdown";
import { className } from "../helpers";
import * as style from "./Routes.module.css";
import * as shared from "../components/shared.module.css";

function AccountSettings() {
  const { user, isDropdownOpen, isLoading } = useContext(AppContext);

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
            <span>Your current email address: test@test.com</span>
            <button {...className(shared.btn, shared.buttonSecondary)}>
              Change
            </button>
          </div>
        </div>
        <div {...className(style.settingsItem)}>
          <span {...className(shared.secondaryTitleText)}>Name</span>
          <span>Set what name to display in the menu</span>
          <div {...className(style.settingsItemCon, style.settingsItemConName)}>
            <input
              type="text"
              {...className(shared.generalInput)}
              placeholder="Name"
            />
            <button {...className(shared.btn, shared.buttonPrimary)}>
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
          <button {...className(shared.btn, shared.buttonDanger)}>
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
