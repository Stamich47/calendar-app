import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Calendar from "./components/Calendar";
import TimeTracker from "./components/TimeTracker";
import Appointments from "./components/Appointments";
import NavBar from "./components/NavBar";

import "./styles.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Manage authentication state

  return (
    <div className="d-flex flex-column container-fluid mt-2">
      <nav className="mb-2">
        <NavBar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      </nav>

      <div>
        <Routes>
          <Route
            path="/"
            element={<Calendar isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/time-tracker"
            element={<TimeTracker isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/appointments"
            element={<Appointments isAuthenticated={isAuthenticated} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
