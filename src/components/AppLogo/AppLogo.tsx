import React, { useContext } from "react";
import NoteLuxLogo from "../../assets/icons/NoteLuxLogo";
import { Link } from "react-router-dom";
import { className } from "../../utilities/helpers";
import * as style from "./AppLogo.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";
import { AppContext } from "../../context/AppContext";

function AppLogo() {
  const { user } = useContext(AppContext);
  return (
    <div {...className(style.logoCon)}>
      <Link {...className(style.linkCon)} to={user ? "/dashboard" : "/"}>
        <NoteLuxLogo {...className(style.notesIcon)} />
        <span {...className(style.name, textStyles.titleText)}>NoteLux</span>
      </Link>
    </div>
  );
}
export default AppLogo;
