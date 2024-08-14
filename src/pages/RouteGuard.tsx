import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PageLoading from "../components/PageLoading/PageLoading";
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
    setUser,
    error,
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
      if (userResult?.emailVerified) {
        setAuthenticatedUserId(userResult.uid);
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
    if (location.pathname === "/") {
      return children;
    }

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

    if (
      location.pathname === "/signup" ||
      location.pathname === "/signin" ||
      location.pathname === "/resetpassword"
    ) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  return <PageLoading />;
}

export default RouteGuard;
