import axios from "axios";
import { useState, useEffect, useCallback } from "react";

// ✅ Konfigurasi baseURL untuk axios berdasarkan environment
axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BASE_URL
    : process.env.REACT_APP_PRODUCTION_URL;

// ✅ Interceptor untuk selalu memakai token terbaru
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ✅ Function untuk mengecek token
const checkAuth = () => {
  let token = localStorage.getItem("token");

  // Jika tidak ada token, redirect ke login (hanya di halaman non-public)
  const PUBLIC_ROUTES = [
    "login",
    "forgot-password",
    "register",
    "documentation",
  ];
  const isPublicPage = PUBLIC_ROUTES.some((r) =>
    window.location.pathname.includes(r)
  );

  if (!token) {
    if (!isPublicPage) {
      window.location.href = "/login";
    }
    return null;
  }

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return token;
};

// ✅ Modal untuk refresh token
function RefreshTokenModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRefreshToken = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `${axios.defaults.baseURL}auth/refresh`;
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      });

      if (response.data) {
        const { status, data } = response.data;
        if (status === "success" && data.token) {
          localStorage.setItem("token", data.token);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.token}`;
          console.log("✅ New Token Updated");
          setTimeout(() => onClose(), 500);
        } else {
          throw new Error("Invalid token response");
        }
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      console.error("❌ Error refreshing token:", err);
      setError("Failed to refresh token. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [onClose]);

  return (
    <>
      {isOpen && (
        <div className="modal modal-open">
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ✅ Interceptor untuk auto-refresh token jika 401 Unauthorized
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        console.log("🔄 Token expired, trying to refresh...");
        const refreshResponse = await axios.get("/auth/refresh");
        const newToken = refreshResponse.data.token;

        localStorage.setItem("token", newToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // 🚀 Ulangi request yang gagal dengan token baru
        error.config.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(error.config);
      } catch (refreshError) {
        console.error("❌ Refresh token failed, redirecting to login...");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ✅ Handler untuk menampilkan modal
const AuthHandler = () => {
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = checkAuth();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="p-4">
      {!isAuthenticated ? (
        <p>🔄 Checking authentication...</p>
      ) : (
        <>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Open Refresh Token Modal
          </button>
          {showModal && (
            <RefreshTokenModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export { checkAuth, AuthHandler };
