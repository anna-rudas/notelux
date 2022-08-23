import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return <div className="wrapper">App</div>;
}

export default App;

createRoot(document.getElementById("root")).render(<App />);
