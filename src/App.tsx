import React from "react";
import { createRoot } from "react-dom/client";
import AppContextProvider from "./context/AppContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import RouteGuard from "./pages/RouteGuard";
import AccountSettings from "./pages/AccountSettings/AccountSettings";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import DashboardContextProvider from "./context/DashboardContext";

function App() {
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
        <DashboardContextProvider>
          <ErrorBoundary onError={logError} FallbackComponent={ErrorPage}>
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          </ErrorBoundary>
        </DashboardContextProvider>
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
    { path: "/*", element: <PageNotFound /> },
  ]);

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
