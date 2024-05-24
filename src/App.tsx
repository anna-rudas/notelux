import React, { useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import AppContextProvider, { AppContext } from "./context";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import NotFound from "./routes/NotFound";

function App() {
  const { loadNotesFromDb, loadUserFromDb, resetDefault } =
    useContext(AppContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />,
    },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/*", element: <NotFound /> },
  ]);

  useEffect(() => {
    //init
    loadNotesFromDb();
    loadUserFromDb();
  }, []);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetDefault();
      }
    };
    window.removeEventListener("keydown", close);
    window.addEventListener("keydown", close);
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
