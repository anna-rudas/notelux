import React from "react";
import * as shared from "../../assets/styles/shared.module.css";
import * as buttons from "../../assets/styles/buttons.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";
import { className } from "../../utilities/helpers";
import { Link } from "react-router-dom";
import PageWrapper from "../../components/templates/PageWrapper";

function NotFound() {
  return (
    <PageWrapper>
      <div {...className(shared.pageContentContainer)}>
        <span {...className(textStyles.titleText)}>Oops!</span>
        <span>Looks like that page doesn&apos;t exist.</span>
        <Link
          to="/dashboard"
          {...className(buttons.btn, buttons.buttonPrimary)}
        >
          Go back
        </Link>
      </div>
    </PageWrapper>
  );
}

export default NotFound;
