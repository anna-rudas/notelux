import React, { useContext } from "react";
import * as buttons from "../../../assets/styles/buttons.module.css";
import { AppContext } from "../../../context/AppContext";
import { className } from "../../../utilities/helpers";
import * as style from "./PrimaryButton.module.css";
import { colors } from "../../../data/constants";
import { DashboardContext } from "../../../context/DashboardContext";
import { Link } from "react-router-dom";

type PrimaryButtonProps = {
  handleClick?: () => void;
  buttonText?: string;
  buttonStyle?: string;
  navigateTo?: string;
  children?: JSX.Element[] | JSX.Element;
};

function PrimaryButton({
  handleClick,
  buttonText,
  buttonStyle = "",
  navigateTo = "",
  children,
}: PrimaryButtonProps) {
  const { isLoading, user } = useContext(AppContext);
  const { activeNote } = useContext(DashboardContext);

  if (navigateTo !== "") {
    return (
      <Link
        to={navigateTo}
        {...className(buttons.btn, style.btn, style.buttonPrimary, buttonStyle)}
      >
        {buttonText && <>{buttonText}</>}
        {children && <>{children}</>}
      </Link>
    );
  }

  return (
    <button
      disabled={isLoading}
      {...className(
        buttons.btn,
        style.btn,
        style.buttonNotePrimary,
        buttonStyle
      )}
      style={
        activeNote && user?.theme === "light"
          ? { color: colors[activeNote.color] }
          : {}
      }
      type="submit"
      onClick={handleClick}
    >
      {buttonText}
    </button>
  );
}

export default PrimaryButton;
