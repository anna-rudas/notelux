import React, { useContext, useState } from "react";
import Header from "../components/Header";
import * as style from "./Routes.module.css";
import * as shared from "../components/shared.module.css";
import { Link } from "react-router-dom";
import { className } from "../helpers";
import { AppContext } from "../context";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import AuthForm from "../components/AuthForm";

function SignUp() {
  const { email, password, isLoading, setIsLoading, addUserInDb } =
    useContext(AppContext);
  const [name, setName] = useState("");

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
      if (signUpResult && signUpResult.user.email) {
        addUserInDb({
          id: signUpResult.user.uid,
          email: signUpResult.user.email,
          username: name,
        });
        try {
          if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser, {
              url: "http://localhost:1234/signin",
            });
          }
        } catch (error: unknown) {
          if (error instanceof FirebaseError) {
            console.error(error.code);
          }
        }
        try {
          if (auth.currentUser) {
            await signOut(auth);
          }
        } catch (error: unknown) {
          if (error instanceof FirebaseError) {
            console.error(error.code);
          }
        }
      }
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
        <AuthForm
          handleSubmit={handleSignUp}
          primaryButtonText="Sign up"
          setName={setName}
        />
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
