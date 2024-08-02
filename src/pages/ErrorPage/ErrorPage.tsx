import React from "react";
import PageWrapper from "../../components/PageWrapper";
import { className } from "../../utilities/helpers";
import * as sharedPages from "../../assets/styles/sharedPages.module.css";
import * as shared from "../../assets/styles/shared.module.css";

function ErrorPage() {
  return (
    <PageWrapper isErrorStyle={true}>
      <>
        <div {...className(sharedPages.contentCon)}>
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
