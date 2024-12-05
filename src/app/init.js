import axios from "axios";

const initializeApp = () => {
  // Setting base URL for all API requests via Axios
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // Development-specific code
    console.log(
      "Development mode: Axios base URL set to",
      axios.defaults.baseURL
    );

    // Additional dev-only setup can go here
  } else {
    // Production-specific code

    // Removing console.log from prod
    console.log = () => {};

    // Initialize analytics here
    console.log(
      "Production mode: Axios base URL set to",
      axios.defaults.baseURL
    );
  }
};

export default initializeApp;
