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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
import DynamicHead from "./DynamicHead"; // ✅ Move this import to the top

const Layout = React.lazy(() => import("./containers/Layout"));
const Login = React.lazy(() => import("./pages/Login"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const Documentation = React.lazy(() => import("./pages/Documentation"));

initializeApp();

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
      <HelmetProvider>
        <DynamicHead />
        <Router>
          <AuthHandler />
          <ToastContainer position="top-right" autoClose={5000} />
          <Routes>
            <Route
              path="/login"
              element={
                <>
                  <DynamicHead noIndex /> <Login />
                </>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <>
                  <DynamicHead noIndex /> <ForgotPassword />
                </>
              }
            />
            <Route
              path="/documentation"
              element={
                <>
                  <DynamicHead /> <Documentation />
                </>
              }
            />
            <Route path="/app/*" element={<Layout />} />
            <Route
              path="*"
              element={
                <Navigate to={token ? "/app/dashboard" : "/login"} replace />
              }
            />
          </Routes>
        </Router>
      </HelmetProvider>
    </>
  );
}

export default App;
