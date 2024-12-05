import React from "react";
import axios from "axios";
import alertify from "alertifyjs"; // Import alertify.js
import "alertifyjs/build/css/alertify.css"; // Import default styles for alertify.js

const TokenRefresh = () => {
  const refreshToken = async () => {
    alertify.confirm(
      "Refresh Token",
      "Apakah Anda yakin ingin memperbarui token?",
      async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}auth/refresh`
          );
          console.log(response.data); // Outputkan response data ke console
          localStorage.setItem("expired_token", "new_refreshed_token"); // Simulate storing the new token
          alertify.success("Token berhasil diperbarui!");
          window.location.reload(); // Reload page after refreshing token
        } catch (error) {
          console.error(error);
          alertify.error("Gagal memperbarui token!");
        }
      },
      () => {
        alertify.message("Pembaharuan token dibatalkan");
      }
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <button
          onClick={refreshToken}
          className="btn btn-primary w-full max-w-xs p-3 text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-lg"
        >
          Refresh Token
        </button>
      </div>
    </div>
  );
};

export default TokenRefresh;
