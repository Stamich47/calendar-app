import { supabase } from "../services/supabaseClient";

export default function ProfileModal({
  displayName,
  setDisplayName,
  onSaveProfile,
  onClose,
}) {
  const verifyDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      deleteAccount();
    }
  };

  const deleteAccount = async () => {
    try {
      // Retrieve the session
      const { data: session, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !session || !session.session) {
        alert("You must be logged in to delete your account.");
        return;
      }

      // Retrieve the user from the session
      const user = session.session.user;
      if (!user || !user.id) {
        alert("No user is logged in.");
        return;
      }

      // Send the user ID to the backend
      const response = await fetch("/.netlify/functions/deleteAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        // Sign out the user from Supabase
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error("Error signing out:", signOutError.message);
          alert("Account deleted, but there was an issue signing you out.");
        } else {
          alert("Account deleted successfully!");
          window.location.reload();
        }
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: await response.text() };
        }
        console.error("Error deleting account:", errorData.error);
        alert("Failed to delete account. Please try again.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
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
              onClick={onClose}
              aria-label="Close"
              data-bs-dismiss="modal"
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
            </form>
          </div>
          <div className="modal-footer d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-danger"
              onClick={verifyDeleteAccount}
            >
              Delete Account
            </button>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onSaveProfile}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
