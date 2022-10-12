import React, { useContext } from "react";
import { createRoot } from "react-dom/client";
import AddNote from "./components/AddNote";
import EditNote from "./components/EditNote";
import Header from "./components/Header";
import Notes from "./components/Notes";
import AppContextProvider, { AppContext } from "./context";

function App() {
  const { isEditing, theme } = useContext(AppContext);

  return (
    <div className="wrapper" data-theme={theme}>
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
