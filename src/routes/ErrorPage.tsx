import React from "react";
import PageWrapper from "../components/PageWrapper";
import { className } from "../helpers";
import * as style from "./Routes.module.css";
import * as shared from "../components/shared.module.css";

function ErrorPage() {
  return (
    <PageWrapper isErrorStyle={true}>
      <>
        <div {...className(style.contentCon)}>
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
