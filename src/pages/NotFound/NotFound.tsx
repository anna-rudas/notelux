import React from "react";
import * as shared from "../../assets/styles/shared.module.css";
import { className } from "../../utilities/helpers";
import { Link } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper";

function NotFound() {
  return (
    <PageWrapper>
      <div {...className(shared.pageContentContainer)}>
        <span {...className(shared.titleText)}>Oops!</span>
        <span>Looks like that page doesn&apos;t exist.</span>
        <Link to="/dashboard" {...className(shared.btn, shared.buttonPrimary)}>
          Go back
        </Link>
      </div>
    </PageWrapper>
  );
}

export default NotFound;
