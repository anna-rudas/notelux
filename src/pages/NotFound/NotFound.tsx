import React from "react";
import * as shared from "../../assets/styles/shared.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";
import { className } from "../../utilities/helpers";
import PageWrapper from "../../components/templates/PageWrapper";
import PrimaryButton from "../../components/buttons/PrimaryButton";

function NotFound() {
  return (
    <PageWrapper>
      <div {...className(shared.pageContentContainer)}>
        <span {...className(textStyles.titleText)}>Oops!</span>
        <span>Looks like that page doesn&apos;t exist.</span>
        <PrimaryButton buttonText="Go back" navigateTo="/dashboard" />
      </div>
    </PageWrapper>
  );
}

export default NotFound;
