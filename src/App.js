import React from "react";
import { createRoot } from "react-dom/client";
import Header from "./components/Header";

function App() {
  return (
    <div className="wrapper">
      <Header />
    </div>
  );
}

export default App;

createRoot(document.getElementById("root")).render(<App />);
