import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App-simple";
import ErrorBoundary from "./ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ErrorBoundary>
);
