import { useState } from "react";
import Calendar from "./components/Calendar";
import NavBar from "./components/NavBar";

import "./styles.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Manage authentication state

  return (
    <>
      <div className="mx-2 mt-5">
        <NavBar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <Calendar isAuthenticated={isAuthenticated} />
        <div className="d-flex justify-content-center"></div>
      </div>
    </>
  );
}

export default App;
