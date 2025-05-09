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
    <>
      <div className="mx-2 mt-5">
        <NavBar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
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
        <div className="d-flex justify-content-center"></div>
      </div>
    </>
  );
}

export default App;
