import React from "react";
import PageWrapper from "../../components/PageWrapper";
import { className } from "../../utilities/helpers";
import * as shared from "../../assets/styles/shared.module.css";

function ErrorPage() {
  return (
    <PageWrapper useUnauthenticatedStyle={true}>
      <>
        <div {...className(shared.pageContentContainer)}>
          <span {...className(shared.titleText)}>Sorry</span>
          <span {...className(shared.normalText)}>
            Unexpected error. Refresh the page or try again later.
          </span>
        </div>
      </>
    </PageWrapper>
  );
}

export default ErrorPage;
