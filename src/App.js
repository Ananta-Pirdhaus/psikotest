import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { themeChange } from "theme-change";
import { checkAuth, AuthHandler } from "./app/auth";
import initializeApp from "./app/init";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const Layout = React.lazy(() => import("./containers/Layout"));
const Login = React.lazy(() => import("./pages/Login"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const Documentation = React.lazy(() => import("./pages/Documentation"));

initializeApp();

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // 🌍 Inisialisasi DaisyUI theme change
    themeChange(false);

    // 🔐 Cek token saat aplikasi dimulai
    const userToken = checkAuth();
    setToken(userToken);
  }, []);

  return (
    <>
      <Router>
      <AuthHandler />
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/app/*" element={<Layout />} />
          <Route
            path="*"
            element={
              <Navigate to={token ? "/app/welcome" : "/login"} replace />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
