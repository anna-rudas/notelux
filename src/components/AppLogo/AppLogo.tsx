import React, { useContext } from "react";
import NoteLuxLogo from "../../assets/icons/NoteLuxLogo";
import { Link } from "react-router-dom";
import { className } from "../../utilities/helpers";
import * as style from "./AppLogo.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import { AppContext } from "../../context/AppContext";

function AppLogo() {
  const { user, isLoading } = useContext(AppContext);
  return (
    <div {...className(style.logoCon)}>
      <Link
        {...className(style.linkCon, isLoading && shared.disabledLink)}
        to={user ? "/dashboard" : "/"}
      >
        <NoteLuxLogo {...className(style.notesIcon)} />
        <span {...className(style.name, shared.titleText)}>NoteLux</span>
      </Link>
    </div>
  );
}
export default AppLogo;
