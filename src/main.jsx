import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./services/slices/store";
import { BrowserRouter } from "react-router";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </Provider>
);
