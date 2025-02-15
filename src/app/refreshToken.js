import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Konfigurasi baseURL untuk axios berdasarkan environment
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;


export default function RefreshTokenModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRefreshToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${axios.defaults.baseURL}auth/refresh`;

      // Hapus token lama sebelum melakukan permintaan token baru
      localStorage.removeItem("token");

      const response = await axios.get(url, { withCredentials: true });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("New Token:", response.data.token);
        onClose(); // Tutup modal setelah sukses
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
      setError("Failed to refresh token. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setError(null); // Reset error ketika modal dibuka
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
            <button
              className="btn btn-primary"
              onClick={handleRefreshToken}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh Token"}
            </button>
            <button className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
