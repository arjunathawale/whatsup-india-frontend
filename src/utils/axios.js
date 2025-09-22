import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthToken, setLogin, setPlanData, setRole, setUserCrendentials, setUserData } from "../store/userSlice";
const axiosInstance = axios.create({
  // baseURL: "http://43.204.220.36:9999/api/v1", // Replace with your API base URL
  baseURL: "http://localhost:9999/api/v1",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Dynamically set Content-Type if not explicitly defined
    if (config.headers["Content-Type"] === undefined) {
      config.headers["Content-Type"] =
        config.data instanceof FormData
          ? "multipart/form-data"
          : "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Logging out...");
      localStorage.clear();
      setTimeout(() => window.location.href = '/login', 1500);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.error("Unauthorized! Logging out...");
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
