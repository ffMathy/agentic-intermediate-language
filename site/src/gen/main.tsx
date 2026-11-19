import { createRoot } from "react-dom/client";
import { HomePage } from "./home/home-page";

const root = document.getElementById("root");

if (root !== null) {
  createRoot(root).render(<HomePage />);
}
