import UserAuth from "./UserAuth";

export default function NavBar({ isAuthenticated, setIsAuthenticated }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Calendar App
        </a>
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
