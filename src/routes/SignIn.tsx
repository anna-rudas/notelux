import React, { useContext, useEffect } from "react";
import Header from "../components/Header";
import * as style from "./Routes.module.css";
import * as shared from "../components/shared.module.css";
import { Link } from "react-router-dom";
import { className } from "../helpers";
import { AppContext } from "../context";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

function SignIn() {
  const {
    setEmail,
    setPassword,
    email,
    password,
    isLoading,
    setIsLoading,
    user,
    loadUserFromDb,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const signInResult = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      loadUserFromDb(signInResult.user.uid);
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
        <span {...className(shared.titleText)}>Sign in</span>
        <form onSubmit={handleSignIn} action="#" {...className(style.formCon)}>
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
            type="submit"
            disabled={isLoading}
            {...className(shared.btn, shared.buttonPrimary, style.buttonSubmit)}
          >
            Sign in
          </button>
        </form>
        <div {...className(style.redirectCon)}>
          <span>Don&apos;t have an account yet?</span>
          <Link
            to="/signup"
            {...className(
              shared.btn,
              shared.buttonSecondary,
              isLoading && shared.disabledLink
            )}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
