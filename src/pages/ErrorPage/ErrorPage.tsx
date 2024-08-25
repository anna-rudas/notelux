import React from "react";
import PageWrapper from "../../components/PageWrapper";
import { className } from "../../utilities/helpers";
import * as shared from "../../assets/styles/shared.module.css";
import * as textStyles from "../../assets/styles/text-styles.module.css";

function ErrorPage() {
  return (
    <PageWrapper useUnauthenticatedStyle={true}>
      <>
        <div {...className(shared.pageContentContainer)}>
          <span {...className(textStyles.titleText)}>Sorry</span>
          <span {...className(textStyles.normalText)}>
            Unexpected error. Refresh the page or try again later.
          </span>
        </div>
      </>
    </PageWrapper>
  );
}

export default ErrorPage;
