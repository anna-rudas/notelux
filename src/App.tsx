import React, { useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import AppContextProvider, { AppContext } from "./context";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import NotFound from "./routes/NotFound";
import RouteGuard from "./routes/RouteGuard";
import AccountSettings from "./routes/AccountSettings";
import ResetPassword from "./routes/ResetPassword";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./routes/ErrorPage";

function App() {
  const { loadNotesFromDb, resetDefault, user } = useContext(AppContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ErrorBoundary onError={logError} FallbackComponent={ErrorPage}>
          <RouteGuard>
            <Dashboard />
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
    //init
    loadNotesFromDb();
    resetDefault();
  }, [user]);

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
