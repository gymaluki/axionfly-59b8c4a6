import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureAffiliateFromUrl, loadAffiliatesFromDb } from "@/lib/affiliates";
import { installErrorLogger } from "@/lib/errorLogger";

// Carrega links de afiliados do banco e captura ?aff=slug na URL
loadAffiliatesFromDb().finally(() => captureAffiliateFromUrl());
installErrorLogger();

createRoot(document.getElementById("root")!).render(<App />);
