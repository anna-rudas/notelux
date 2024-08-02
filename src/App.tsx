import React, { useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import AppContextProvider, { AppContext } from "./context/context";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import NotFound from "./pages/NotFound/NotFound";
import RouteGuard from "./pages/RouteGuard";
import AccountSettings from "./pages/AccountSettings/AccountSettings";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import LandingPage from "./pages/LandingPage/LandingPage";

function App() {
  const { resetDefault } = useContext(AppContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ErrorBoundary onError={logError} FallbackComponent={ErrorPage}>
          <RouteGuard>
            <LandingPage />
          </RouteGuard>
        </ErrorBoundary>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ErrorBoundary onError={logError} FallbackComponent={ErrorPage}>
          <RouteGuard>
            <Dashboard />
          </RouteGuard>
        </ErrorBoundary>
      ),
    },
    {
      path: "/settings",
      element: (
        <ErrorBoundary onError={logError} FallbackComponent={ErrorPage}>
          <RouteGuard>
            <AccountSettings />
          </RouteGuard>
        </ErrorBoundary>
      ),
    },
    {
      path: "/signin",
      element: (
        <ErrorBoundary onError={logError} FallbackComponent={ErrorPage}>
          <RouteGuard>
            <SignIn />
          </RouteGuard>
        </ErrorBoundary>
      ),
    },
    {
      path: "/signup",
      element: (
        <ErrorBoundary onError={logError} FallbackComponent={ErrorPage}>
          <RouteGuard>
            <SignUp />
          </RouteGuard>
        </ErrorBoundary>
      ),
    },
    {
      path: "/resetpassword",
      element: (
        <ErrorBoundary onError={logError} FallbackComponent={ErrorPage}>
          <RouteGuard>
            <ResetPassword />
          </RouteGuard>
        </ErrorBoundary>
      ),
    },
    { path: "/*", element: <NotFound /> },
  ]);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetDefault();
      }
    };

    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("keydown", close);
    };
  }, [resetDefault]);

  return <RouterProvider router={router}></RouterProvider>;
}

const logError = (error: Error) => {
  console.error("Unexpected error: ", error);
};

function AppWithProvider() {
  return (
    <ErrorBoundary onError={logError} FallbackComponent={ErrorPage}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ErrorBoundary>
  );
}

export default AppWithProvider;

createRoot(document.getElementById("root")!).render(<AppWithProvider />);
