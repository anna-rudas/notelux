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
import CreateAccount from "./pages/CreatePermanentAccount";
import FontFaceObserver from "fontfaceobserver";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://3c5d948cc7227d50f73bd18e5f5fcc19@o4508161927348224.ingest.de.sentry.io/4508455583940688",
  integrations: [],
});

const primaryFontObserver = new FontFaceObserver("Roboto");
const secondaryFontObserver = new FontFaceObserver("Oswald");

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
      path: "/create-account",
      element: (
        <ErrorBoundary onError={logError} FallbackComponent={ErrorPage}>
          <RouteGuard>
            <CreateAccount />
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

Promise.all([primaryFontObserver.load(), secondaryFontObserver.load()]).then(
  () => {
    createRoot(document.getElementById("root")!).render(<AppWithProvider />);
  }
);
