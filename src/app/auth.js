import axios from "axios";

const checkAuth = () => {
  // Setting base URL for all API requests via Axios
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

  /* Simulating fetching the token value stored in localStorage.
     Here, we simulate the 'expired_token' value being null or 0 for testing purposes. */
  let TOKEN = localStorage.getItem("expired_token");

  if (TOKEN === "null" || TOKEN === "0") {
    // Simulating an expired token or missing token
    console.log("Token expired or missing. Attempting to refresh token...");

    // Simulate refreshing the token by calling a fake API endpoint
    return refreshToken();
  }

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

// Simulating a function to refresh the token (you would normally call your API here)
const refreshToken = () => {
  // Simulate a delay for refreshing the token (e.g., API request delay)
  setTimeout(() => {
    console.log("Token has been refreshed!");

    // Simulate setting a new token in localStorage after successful refresh
    localStorage.setItem("expired_token", "new_refreshed_token");

    // Re-run the checkAuth function after token is refreshed
    checkAuth();
  }, 2000); // Simulating a 2-second delay for refreshing the token
};

export default checkAuth;
