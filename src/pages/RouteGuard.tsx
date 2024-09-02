import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PageLoading from "../components/loaders/PageLoading/PageLoading";
import { useLocation } from "react-router-dom";
import { defaultToastMessage } from "../data/constants";
import { FirebaseError } from "firebase/app";
import ErrorPage from "./ErrorPage/ErrorPage";
import { signOutUser } from "../firestore/authService";

type RouteGuardProps = {
  children: JSX.Element;
};

function RouteGuard({ children }: RouteGuardProps) {
  const {
    user,
    setToastMessageContent,
    setAuthenticatedUserId,
    setAnonymousUserId,
    setUser,
    error,
    authenticatedUserId,
    setIsDropdownOpen,
  } = useContext(AppContext);
  const auth = getAuth();
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setAuthenticatedUserId(null);
      setUser(null);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to sign out user: ", error.code);
      }
    }
  };

  useEffect(() => {
    setToastMessageContent(defaultToastMessage);
    setIsDropdownOpen(false);
    const unSubscribe = onAuthStateChanged(auth, (userResult) => {
      if (userResult?.emailVerified && !userResult.isAnonymous) {
        setAuthenticatedUserId(userResult.uid);
      } else if (userResult?.isAnonymous) {
        setAnonymousUserId(userResult.uid);
      } else {
        setIsPageLoading(false);
      }
    });
    return unSubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      setIsPageLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      handleSignOut();
    }
  }, [error]);

  if (error) {
    return <ErrorPage></ErrorPage>;
  }

  if (!isPageLoading) {
    //user is signed out
    if (!user) {
      if (
        location.pathname === "/signup" ||
        location.pathname === "/signin" ||
        location.pathname === "/resetpassword"
      ) {
        return children;
      }
      return <Navigate to="/signin" replace />;
    }

    //user is signed in
    if (
      location.pathname === "/signup" ||
      location.pathname === "/signin" ||
      location.pathname === "/resetpassword"
    ) {
      return <Navigate to="/dashboard" replace />;
    } else if (authenticatedUserId && location.pathname === "/create-account") {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  return <PageLoading />;
}

export default RouteGuard;
