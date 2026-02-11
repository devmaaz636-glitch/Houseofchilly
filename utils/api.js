import axios from "axios";

// Your PC IP from ipconfig
const BASE_URL = "http://192.168.1.15:5000/api";

// Set timeout
axios.defaults.timeout = 15000; // 15 seconds

// 🔹 Send reset link
export const forgotPassword = async (email) => {
  try {
    console.log("🔹 Sending reset link to:", email);
    console.log("🔹 Using API:", `${BASE_URL}/auth/forgot-password`);
    
    const res = await axios.post(
      `${BASE_URL}/auth/forgot-password`, 
      { email: email.trim().toLowerCase() },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    console.log("✅ Response:", res.data);
    return res.data;
    
  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.response) throw err.response.data;
    else if (err.request) throw { msg: "Cannot connect to server. Make sure backend is running" };
    else throw { msg: err.message || "An error occurred" };
  }
};

// 🔹 Reset password with token
export const resetPassword = async (token, newPassword) => {
  try {
    console.log("🔹 Resetting password for token:", token);

    const res = await axios.post(
      `${BASE_URL}/auth/reset-password`,
      { token, newPassword },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    console.log("✅ Response:", res.data);
    return res.data;

  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.response) throw err.response.data;
    else if (err.request) throw { msg: "Cannot connect to server. Make sure backend is running" };
    else throw { msg: err.message || "An error occurred" };
  }
};