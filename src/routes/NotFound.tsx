import React from "react";
import Header from "../components/Header";
import * as shared from "../components/shared.module.css";
import * as style from "./Routes.module.css";
import { className } from "../helpers";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="wrapper">
      <Header loggedInStyle={false} />
      <div {...className(style.contentCon)}>
        <span {...className(shared.titleText)}>Oops!</span>
        <span>Looks like that page doesn&apos;t exist.</span>
        <Link
          to="/"
          {...className(shared.btn, shared.buttonPrimary, shared.buttonSubmit)}
        >
          Go back
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
