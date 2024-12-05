import React, { lazy, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { themeChange } from "theme-change";
import checkAuth from "./app/auth";
import initializeApp from "./app/init";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
// Importing pages
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Documentation = lazy(() => import("./pages/Documentation"));
// Initializing different libraries
initializeApp();

// Check for login and initialize axios
const token = checkAuth();

function App() {
  useEffect(() => {
    // 👆 daisy UI themes initialization
    themeChange(false);
  }, []);

  return (
    <>
      <Router>
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
