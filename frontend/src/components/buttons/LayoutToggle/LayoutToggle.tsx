import React, { useContext } from "react";
import GridIcon from "../../../assets/icons/GridIcon";
import ListIcon from "../../../assets/icons/ListIcon";
import * as style from "./LayoutToggle.module.css";
import { AppContext } from "../../../context/AppContext";
import { className } from "../../../utilities/helpers";
import { updateUserInDb } from "../../../services/userService";

function LayoutToggle() {
  const { user, isLoading, setToastMessageContent } = useContext(AppContext);

  if (user === null) {
    return null;
  }

  const toggleLayout = () => {
    try {
      updateUserInDb({
        ...user,
        layout: user.layout === "grid" ? "list" : "grid",
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
      onClick={toggleLayout}
      title={user.layout === "grid" ? "Grid view" : "List view"}
    >
      {user.layout === "grid" ? (
        <GridIcon {...className(style.icon)} />
      ) : (
        <ListIcon {...className(style.icon)} />
      )}
    </button>
  );
}

export default LayoutToggle;
