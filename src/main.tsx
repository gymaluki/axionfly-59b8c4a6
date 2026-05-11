import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureAffiliateFromUrl } from "@/lib/affiliates";
import { installErrorLogger } from "@/lib/errorLogger";

// Captura ?aff=slug na URL e persiste por 30 dias para tracking de afiliados
captureAffiliateFromUrl();
installErrorLogger();

createRoot(document.getElementById("root")!).render(<App />);
