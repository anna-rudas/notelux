import React, { useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import AddNote from "./components/AddNote";
import EditNote from "./components/EditNote";
import Header from "./components/Header";
import Notes from "./components/Notes";
import AppContextProvider, { AppContext } from "./context";
import { defaultTheme } from "./constants";

function App() {
  const { isEditing, loadNotesFromDb, loadUserFromDb, resetDefault, user } =
    useContext(AppContext);

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

  return (
    <div className="wrapper" data-theme={user?.theme ?? defaultTheme}>
      <Header />
      <AddNote />
      <Notes />
      {isEditing && <EditNote />}
    </div>
  );
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
