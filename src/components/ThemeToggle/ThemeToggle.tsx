import React, { useContext } from "react";
import { defaultTheme } from "../../data/constants";
import SunIcon from "../../assets/icons/SunIcon";
import MoonIcon from "../../assets/icons/MoonIcon";
import * as style from "./ThemeToggle.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import { AppContext } from "../../context/AppContext";
import { className } from "../../utilities/helpers";

function ThemeToggle() {
  const { user, setUser, isLoading } = useContext(AppContext);

  if (user === null) {
    return null;
  }

  const toggleTheme = () => {
    setUser({
      ...user,
      theme: user.theme === "light" ? "dark" : "light",
    });
  };

  return (
    <button
      disabled={isLoading}
      {...className(style.iconBtn, isLoading && shared.btnDisabled)}
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
