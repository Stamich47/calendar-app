import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import ProfileModal from "./ProfileModal"; // Import the new component
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function UserAuth({ isAuthenticated, setIsAuthenticated }) {
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const restoreSession = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return;
      }

      if (user) {
        setIsAuthenticated(true);

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
        data: { display_name: displayName },
      });

      if (updateError) {
        console.error("Error updating profile:", updateError.message);
        alert("Failed to update profile: " + updateError.message);
      } else {
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
        <div className="dropdown d-flex align-items-center">
          {displayName && <span className="mx-2">Hello, {displayName} </span>}
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle"></i>
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
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-person-plus"></i>
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

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <ProfileModal
          displayName={displayName}
          setDisplayName={setDisplayName}
          onSaveProfile={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}
