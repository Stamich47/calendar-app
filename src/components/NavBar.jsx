import UserAuth from "./UserAuth";
import { FaRegCalendarAlt, FaClock, FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function NavBar({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();

  const getCurrentIcon = () => {
    switch (location.pathname) {
      case "/":
        return <FaRegCalendarAlt />;
      case "/time-tracker":
        return <FaClock />;
      case "/appointments":
        return <FaClipboardList />;
      default:
        return null;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-brand dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
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
