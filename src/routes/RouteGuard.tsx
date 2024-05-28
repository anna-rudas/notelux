import React, { useContext, useEffect } from "react";
import { AppContext } from "../context";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PageLoading from "./PageLoading";
import { useLocation } from "react-router-dom";

type RouteGuardProps = {
  children: JSX.Element;
};

function RouteGuard({ children }: RouteGuardProps) {
  const { user, loadUserFromDb, isPageLoading, setIsPageLoading } =
    useContext(AppContext);
  const auth = getAuth();
  const location = useLocation();

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (userResult) => {
      if (userResult) {
        loadUserFromDb(userResult.uid);
      } else {
        setIsPageLoading(false);
      }
    });
    return () => {
      unSubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      setIsPageLoading(false);
    }
  }, [user]);

  if (!isPageLoading) {
    if (!user) {
      if (location.pathname === "/signup" || location.pathname === "/signin") {
        return children;
      }
      return <Navigate to="/signin" replace />;
    }

    if (
      location.pathname === "/signup" ||
      location.pathname === "/signin" ||
      location.pathname === "/"
    ) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  return <PageLoading />;
}

export default RouteGuard;
