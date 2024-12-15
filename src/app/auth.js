import axios from "axios";

const checkAuth = () => {
  // Setting base URL for all API requests via Axios
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

  // Fetching the token value stored in localStorage
  let TOKEN = localStorage.getItem("expired_token");

  const PUBLIC_ROUTES = [
    "login",
    "forgot-password",
    "register",
    "documentation",
  ];

  const isPublicPage = PUBLIC_ROUTES.some((r) =>
    window.location.href.includes(r)
  );

  if (!TOKEN && !isPublicPage) {
    window.location.href = "/login";
    return;
  } else {
    // Set Authorization header for all Axios requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

    // Add Axios interceptors to manage loading indicator
    axios.interceptors.request.use(
      function (config) {
        // Show global loading indicator on request start
        document.body.classList.add("loading-indicator");
        return config;
      },
      function (error) {
        // Handle request errors
        document.body.classList.remove("loading-indicator");
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function (response) {
        // Hide global loading indicator on request success
        document.body.classList.remove("loading-indicator");
        return response;
      },
      function (error) {
        // Hide global loading indicator on request failure
        document.body.classList.remove("loading-indicator");
        return Promise.reject(error);
      }
    );

    return TOKEN;
  }
};

export default checkAuth;
