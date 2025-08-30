import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import FloatingChatbot from "./Components/Queries/bookrecomend";
import { UserProvider } from "./Hooks/UserContext"; // ✅ import your provider

if (process.env.NODE_ENV === "production") disableReactDevTools();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider> {/* ✅ Wrap your app and chatbot in UserProvider */}
      <App />
      <FloatingChatbot />
    </UserProvider>
  </React.StrictMode>
);
