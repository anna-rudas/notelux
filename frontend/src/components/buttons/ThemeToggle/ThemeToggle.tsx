import React, { useContext } from "react";
import SunIcon from "../../../assets/icons/SunIcon";
import MoonIcon from "../../../assets/icons/MoonIcon";
import * as style from "./ThemeToggle.module.css";
import { AppContext } from "../../../context/AppContext";
import { className } from "../../../utilities/helpers";
import { updateUserInDb } from "../../../services/userService";

function ThemeToggle() {
  const { user, isLoading, setToastMessageContent } = useContext(AppContext);

  if (user === null) {
    return null;
  }

  const toggleTheme = () => {
    try {
      updateUserInDb({
        ...user,
        theme: user.theme === "light" ? "dark" : "light",
      });
    } catch (error: unknown) {
      console.error("Failed to update user in database: ", error);
      setToastMessageContent({
        actionButtonText: "",
        isPersisting: false,
        showMessage: true,
        isError: true,
        description: `Failed to save changes: ${error}`,
      });
    }
  };

  return (
    <button
      disabled={isLoading}
      {...className(style.iconBtn)}
      onClick={toggleTheme}
      title={user.theme === "light" ? "Light mode" : "Dark mode"}
    >
      {user.theme === "light" ? (
        <SunIcon {...className(style.icon)} />
      ) : (
        <MoonIcon {...className(style.icon)} />
      )}
    </button>
  );
}

export default ThemeToggle;
