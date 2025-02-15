import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

// ✅ Konfigurasi baseURL untuk axios berdasarkan environment
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

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

function RefreshTokenModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRefreshToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

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
          setSuccess(true);
          setTimeout(() => onClose(), 1000);
        } else {
          throw new Error("Token tidak valid");
        }
      } else {
        throw new Error("Token tidak diterima");
      }
    } catch (err) {
      console.error("❌ Error refreshing token:", err);
      setError("Gagal memperbarui token. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [onClose]);

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96 animate-fade-in">
          <div className="flex items-center gap-3 border-b pb-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-bold">Sesi Berakhir</h3>
          </div>
          <p className="py-3 text-gray-600">
            Anda telah tidak aktif terlalu lama. Silakan perbarui sesi Anda.
          </p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircleIcon className="w-6 h-6" />
              <p>Token berhasil diperbarui!</p>
            </div>
          )}
          <div className="flex justify-end mt-4 gap-2">
            <button
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            <button
              className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
              onClick={handleRefreshToken}
              disabled={loading}
            >
              {loading ? "Memperbarui..." : "Perbarui Token"}
            </button>
          </div>
        </div>
      </div>
    )
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
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }

    let idleTimer;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        console.log("⏳ User is idle, showing refresh token modal...");
        setShowModal(true);
      }, 180000); // 1 menit
    };

    // ✅ Event listener untuk mendeteksi aktivitas
    const events = ["mousemove", "keydown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));

    // Mulai timer pertama kali
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
    };
  }, []);

  return (
    <div>
      {showModal && (
        <RefreshTokenModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export { checkAuth, AuthHandler };
