import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from '../context/ToastContext';
import axiosInstance from "../utils/axios";
import { useDispatch, useSelector } from 'react-redux'
import {
  setLogin,
  setUserData,
  setRole,
  setUserCrendentials,
  setAuthToken,
  setPlanData
} from '../store/userSlice'
import { endPoints } from "../utils/apiEndPoint";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
const LoginPage = () => {
  const showToast = useToast()
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch()

  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!emailOrMobile || !password) {
        showToast('info', 'Please fill all the fields');
        return;
      }
      const res = await axiosInstance.post(endPoints.login, {
        username: emailOrMobile,
        password,
      })
      const data = res?.data?.data
      if (res?.data?.status) {
        dispatch(setUserData(data?.user))
        dispatch(setRole(data?.role))
        dispatch(setAuthToken(data?.accessToken))
        dispatch(setUserCrendentials(
          data?.user?.client?.clientMetaConfigs || {}
        ))
        dispatch(setPlanData(data?.user?.client?.activeSubscription[0] || {}))
        dispatch(setLogin(true))
        showToast('success', 'Logged In Successfully');
        navigate('/')
      } else {
        showToast('error', 'Invalid Credentials');
      }
    } catch (error) {
      showToast('error', error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Mobile Input */}
          <input
            type="text"
            placeholder="Enter Email ID or Mobile No."
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full outline-none"
          />
          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full outline-none"
            />
            {
              showPassword ? <FaRegEye
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              /> : <FaRegEyeSlash
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            }

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition"
            onClick={handleSubmit}
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Forgot Password? <a href="#" className="text-blue-500">Click Here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
