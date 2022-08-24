import React from "react";
import { createRoot } from "react-dom/client";
import AddNote from "./components/AddNote";
import Header from "./components/Header";

function App() {
  return (
    <div className="wrapper">
      <Header />
      <AddNote />
    </div>
  );
}

export default App;

createRoot(document.getElementById("root")).render(<App />);
