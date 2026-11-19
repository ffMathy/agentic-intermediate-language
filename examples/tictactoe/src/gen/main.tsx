import { createRoot } from "react-dom/client";
import { App } from "./app/app";
import "./tokens.css";

createRoot(document.getElementById("root")!).render(<App />);
