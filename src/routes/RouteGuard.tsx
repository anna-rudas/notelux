import React, { useContext, useEffect } from "react";
import { AppContext } from "../context";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import PageLoading from "./PageLoading";
import { useLocation } from "react-router-dom";
import { defaultInfoMsg } from "../constants";
import { FirebaseError } from "firebase/app";
import ErrorPage from "./ErrorPage";

type RouteGuardProps = {
  children: JSX.Element;
};

function RouteGuard({ children }: RouteGuardProps) {
  const {
    user,
    isPageLoading,
    setIsPageLoading,
    setInfoMessage,
    setUserId,
    error,
    setUser,
  } = useContext(AppContext);
  const auth = getAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to sign out user: ", error.code);
      }
    }
  };

  useEffect(() => {
    setInfoMessage(defaultInfoMsg);
    const unSubscribe = onAuthStateChanged(auth, (userResult) => {
      if (userResult?.emailVerified) {
        setUserId(userResult.uid);
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
      setUserId(null);
      setUser(null);
    }
  }, [error]);

  if (error) {
    return <ErrorPage></ErrorPage>;
  }

  if (!isPageLoading) {
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
      location.pathname === "/resetpassword" ||
      location.pathname === "/"
    ) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  return <PageLoading />;
}

export default RouteGuard;
