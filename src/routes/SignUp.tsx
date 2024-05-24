import React from "react";
import Header from "../components/Header";
import * as style from "./Routes.module.css";
import * as shared from "../components/shared.module.css";
import { Link } from "react-router-dom";
import { className } from "../helpers";

function SignUp() {
  return (
    <div className="wrapper">
      <Header loggedInStyle={false} />
      <div {...className(style.contentCon)}>
        <span {...className(shared.titleText)}>Sign up</span>
        <form action="#" {...className(style.formCon)}>
          <input
            {...className(shared.generalInput)}
            type="text"
            placeholder="Email"
          />
          <input
            {...className(shared.generalInput)}
            type="text"
            placeholder="Password"
          />
          <button
            {...className(shared.btn, shared.buttonPrimary, style.buttonSubmit)}
          >
            Sign up
          </button>
        </form>
        <div {...className(style.redirectCon)}>
          <span>Already have an account?</span>
          <Link to="/signin" {...className(shared.btn, shared.buttonSecondary)}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
