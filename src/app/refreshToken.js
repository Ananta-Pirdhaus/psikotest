import { useState, useEffect } from "react";
import { Modal, Button } from "daisyui";
import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_URL // Gunakan variabel dari .env saat development
    : process.env.REACT_APP_PRODUCTION_URL; // Gunakan URL produksi dari .env

export default function RefreshTokenModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRefreshToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "/api/refresh-token",
        {},
        { withCredentials: true }
      );
      console.log("New Token:", response.data.token);
      onClose();
    } catch (err) {
      setError("Failed to refresh token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  return (
    <>
      <input
        type="checkbox"
        id="refresh-token-modal"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Session Expired</h3>
          <p className="py-2">
            Your session has expired. Please refresh your token to continue.
          </p>
          {error && <p className="text-red-500">{error}</p>}
          <div className="modal-action">
            <Button
              className="btn btn-primary"
              onClick={handleRefreshToken}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh Token"}
            </Button>
            <label
              htmlFor="refresh-token-modal"
              className="btn"
              onClick={onClose}
            >
              Cancel
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
