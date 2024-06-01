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

function App() {
  const { loadNotesFromDb, resetDefault, user } = useContext(AppContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <RouteGuard>
          <Dashboard />
        </RouteGuard>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <RouteGuard>
          <Dashboard />
        </RouteGuard>
      ),
    },
    {
      path: "/settings",
      element: (
        <RouteGuard>
          <AccountSettings />
        </RouteGuard>
      ),
    },
    {
      path: "/signin",
      element: (
        <RouteGuard>
          <SignIn />
        </RouteGuard>
      ),
    },
    {
      path: "/signup",
      element: (
        <RouteGuard>
          <SignUp />
        </RouteGuard>
      ),
    },
    { path: "/*", element: <NotFound /> },
  ]);

  useEffect(() => {
    //init
    loadNotesFromDb();
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

function AppWithProvider() {
  return (
    <AppContextProvider>
      <App />
    </AppContextProvider>
  );
}

export default AppWithProvider;

createRoot(document.getElementById("root")!).render(<AppWithProvider />);
