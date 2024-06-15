import React from "react";
import * as shared from "../components/shared.module.css";
import * as style from "./Routes.module.css";
import { className } from "../helpers";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

function NotFound() {
  return (
    <PageWrapper isAuthStyle={false}>
      <div {...className(style.contentCon)}>
        <span {...className(shared.titleText)}>Oops!</span>
        <span>Looks like that page doesn&apos;t exist.</span>
        <Link to="/" {...className(shared.btn, shared.buttonPrimary)}>
          Go back
        </Link>
      </div>
    </PageWrapper>
  );
}

export default NotFound;
