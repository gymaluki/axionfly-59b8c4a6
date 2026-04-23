import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureAffiliateFromUrl } from "@/lib/affiliates";

// Captura ?aff=slug na URL e persiste por 30 dias para tracking de afiliados
captureAffiliateFromUrl();

createRoot(document.getElementById("root")!).render(<App />);
