import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function UserAuth({ isAuthenticated, setIsAuthenticated }) {
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [showProfileModal, setShowProfileModal] = useState(false); // State to control profile modal visibility
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState(""); // State for display name
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password

  // Restore session on component mount
  useEffect(() => {
    const restoreSession = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error restoring session:", error.message);
        return;
      }

      if (user) {
        setIsAuthenticated(true);

        // Fetch and set the displayName from user metadata
        const userMetadata = user.user_metadata || {};
        if (userMetadata.display_name) {
          setDisplayName(userMetadata.display_name);
        }
      }
    };

    restoreSession();
  }, [setIsAuthenticated]);

  const handleAuth = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
      else {
        setIsAuthenticated(true);
        alert("Logged in successfully!");
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Signup successful! Please check your email to confirm.");
    }
    setShowModal(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    else setIsAuthenticated(false);
  };

  const handleSaveProfile = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error.message);
      alert("Failed to fetch user session.");
      return;
    }

    if (user) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { display_name: displayName }, // Update the display_name in user metadata
      });

      if (updateError) {
        console.error("Error updating profile:", updateError.message);
        alert("Failed to update profile: " + updateError.message);
      } else {
        // Fetch updated user metadata
        const { data: updatedUser, error: fetchError } =
          await supabase.auth.getUser();
        if (fetchError) {
          console.error("Error fetching updated user:", fetchError.message);
        } else {
          console.log("Updated user data:", updatedUser);
          const updatedMetadata = updatedUser.user_metadata || {};
          if (updatedMetadata.display_name) {
            setDisplayName(updatedMetadata.display_name);
          }
          alert("Profile updated successfully!");
          setShowProfileModal(false);
        }
      }
    } else {
      alert("No user is logged in.");
    }
  };

  return (
    <>
      {isAuthenticated ? (
        // Authenticated: Profile Outline Icon

        <div className="dropdown d-flex align-items-center">
          {displayName && <span className="mx-2">Hello, {displayName} </span>}
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle"></i> {/* Profile Outline Icon */}
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="profileDropdown"
          >
            <li>
              <button
                className="dropdown-item"
                onClick={() => {
                  setShowProfileModal(true);
                }}
              >
                Profile Settings{" "}
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      ) : (
        // Unauthenticated: Profile Icon with Plus
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-person-plus"></i> {/* Profile Icon with Plus */}
        </button>
      )}

      {/* Modal for Login/Signup */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isLogin ? "Login" : "Sign Up"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAuth}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {!isLogin && (
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary w-100">
                    {isLogin ? "Login" : "Sign Up"}
                  </button>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Switch to Sign Up" : "Switch to Login"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {Modal for Profile Settings, including the Display Name} */}
      {showProfileModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile Settings</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="displayName" className="form-label">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  {/* Add more profile settings here */}
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveProfile}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowProfileModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
