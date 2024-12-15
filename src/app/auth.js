import axios from "axios";

// Fungsi untuk mendecode JWT
const parseJWT = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  const decoded = JSON.parse(window.atob(base64));
  return decoded;
};

const checkAuth = () => {
  // Setting base URL for all API requests via Axios
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

  // Fetching the token value stored in localStorage
  let TOKEN = localStorage.getItem("token");

  if (TOKEN) {
    // Decode token and check the expiration time
    const decodedToken = parseJWT(TOKEN);
    const expirationTime = decodedToken.exp * 1000; // Convert exp to milliseconds
    const currentTime = Date.now(); // Current time in milliseconds

    // Check if the token is expired
    if (currentTime >= expirationTime) {
      // Token expired, redirect to login page
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

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
  } else {
    // If no token exists, redirect to login
    window.location.href = "/login";
    return;
  }
};

export default checkAuth;
