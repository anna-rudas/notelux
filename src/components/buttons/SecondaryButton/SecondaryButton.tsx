import React, { useContext } from "react";
import * as buttons from "../../../assets/styles/buttons.module.css";
import { AppContext } from "../../../context/AppContext";
import { className } from "../../../utilities/helpers";
import * as style from "./SecondaryButton.module.css";
import { colors } from "../../../data/constants";
import { DashboardContext } from "../../../context/DashboardContext";
import { Link } from "react-router-dom";

type SecondaryButtonProps = {
  handleClick?: () => void;
  buttonText: string;
  buttonStyle?: string;
  navigateTo?: string;
};

function SecondaryButton({
  handleClick,
  buttonText,
  buttonStyle = "",
  navigateTo = "",
}: SecondaryButtonProps) {
  const { isLoading, user } = useContext(AppContext);
  const { activeNote } = useContext(DashboardContext);

  if (navigateTo !== "") {
    return (
      <Link
        to={navigateTo}
        {...className(
          buttons.btn,
          style.btn,
          style.buttonSecondary,
          buttonStyle
        )}
      >
        {buttonText}
      </Link>
    );
  }

  return (
    <button
      disabled={isLoading}
      {...className(
        buttons.btn,
        style.btn,
        style.buttonNoteSecondary,
        buttonStyle
      )}
      style={
        activeNote && user?.theme === "light"
          ? { backgroundColor: colors[activeNote.color] }
          : { backgroundColor: "var(--bg)" }
      }
      type="button"
      onClick={handleClick}
    >
      {buttonText}
    </button>
  );
}

export default SecondaryButton;
