import React, { useContext } from "react";
import GridIcon from "../../assets/icons/GridIcon";
import ListIcon from "../../assets/icons/ListIcon";
import * as style from "./LayoutToggle.module.css";
import { AppContext } from "../../context/AppContext";
import { className } from "../../utilities/helpers";

function LayoutToggle() {
  const { user, setUser, isLoading } = useContext(AppContext);

  if (user === null) {
    return null;
  }

  const toggleLayout = () => {
    setUser({
      ...user,
      layout: user.layout === "grid" ? "list" : "grid",
    });
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
