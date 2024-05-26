import React, { useContext } from "react";
import Header from "../components/Header";
import * as style from "./Routes.module.css";
import * as shared from "../components/shared.module.css";
import { Link } from "react-router-dom";
import { className } from "../helpers";
import { AppContext } from "../context";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

function SignUp() {
  const {
    setEmail,
    setPassword,
    email,
    password,
    isLoading,
    setIsLoading,
    addUserInDb,
  } = useContext(AppContext);

  const auth = getAuth();

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const signUpResult = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      addUserInDb({ id: signUpResult.user.uid });
      setIsLoading(false);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(error.code);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="wrapper">
      {isLoading && <div {...className(shared.loadingModal)}></div>}
      <Header loggedInStyle={false} />
      <div {...className(style.contentCon)}>
        <span {...className(shared.titleText)}>Sign up</span>
        <form onSubmit={handleSignUp} action="#" {...className(style.formCon)}>
          <input
            disabled={isLoading}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            {...className(shared.generalInput)}
            type="text"
            placeholder="Email"
          />
          <input
            disabled={isLoading}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            {...className(shared.generalInput)}
            type="text"
            placeholder="Password"
          />
          <button
            disabled={isLoading}
            type="submit"
            {...className(shared.btn, shared.buttonPrimary, style.buttonSubmit)}
          >
            Sign up
          </button>
        </form>
        <div {...className(style.redirectCon)}>
          <span>Already have an account?</span>
          <Link
            to="/signin"
            {...className(
              shared.btn,
              shared.buttonSecondary,
              isLoading && shared.disabledLink
            )}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
