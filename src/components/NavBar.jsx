import UserAuth from "./UserAuth";
import { FaRegCalendarAlt, FaClock, FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function NavBar({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();

  const getCurrentIcon = () => {
    switch (location.pathname) {
      case "/":
        return <i className="bi bi-calendar3"></i>;
      case "/time-tracker":
        return <i className="bi bi-clock-history"></i>;
      case "/appointments":
        return <i className="bi bi-clipboard-check-fill"></i>;
      default:
        return null;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border border-1 rounded-3">
      <div className="container-fluid">
        <div className="navbar-brand dropdown">
          <button
            className="btn btn-outline-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {getCurrentIcon()}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <Link className="dropdown-item" to="/">
                Calendar
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/appointments">
                Appointments
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/time-tracker">
                Time Tracker
              </Link>
            </li>
          </ul>
        </div>

        <div className="d-flex">
          <UserAuth
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
          />
        </div>
      </div>
    </nav>
  );
}
