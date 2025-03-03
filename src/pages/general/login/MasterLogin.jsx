import React, { useState } from "react";
import masterimg from "../../../assets/master.svg";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const MasterLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReg, setIsReg] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await AxiosInstance.post("/master/login-master", {
        email,
        password,
      });

      if (response.data.message === "Login successful") {
        sessionStorage.setItem(
          "master",
          JSON.stringify(response.data.response)
        );
        message.success(response.data.message);
        setIsLoggedIn(true);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Failed to login");
      console.log(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await AxiosInstance.post("/master/add-master", {
        name,
        email,
        phone,
        role,
        password,
      });
      if (response.data.status === 201) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      setIsReg(false);
    } catch (error) {
      message.error("Failed to register");
      console.log(error);
    }
  };

  return (
    <div className="master-login-container w-screen fixed top-0 left-0 flex justify-center items-center min-h-screen ">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-blue-500 absolute top-5 right-5 z-50 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center"
        >
          Clinic
        </button>
      </div>
      {isLoggedIn ? (
        navigate("/master-admin")
      ) : isReg ? (
        <div className="relative w-screen h-screen overflow-hidden flex justify-center items-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30"></div>
          <img
            src={masterimg}
            alt="Master Logo"
            className="img-fluid mb-2 absolute z-0 w-full h-full object-scale-down opacity-20 transform hover:scale-105 transition-transform duration-700"
          />
          <form
            onSubmit={handleRegister}
            className="w-96 h-fit p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-xl mx-auto mt-5 z-50 flex flex-col absolute border border-white border-opacity-30 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-center mb-6 text-primary text-2xl font-semibold">
              Master Register
            </h2>
            <div className="mb-2">
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Enter Name"
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Enter Email"
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Phone Number:
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Enter Phone Number"
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Role:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-control w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Enter password"
                required
              />
            </div>
            <div className="mb-6">
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Confirm Password:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Confirm password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn bg-blue-600 hover:bg-blue-700 text-white w-full py-2 mb-3 rounded-md transition-colors duration-300 font-semibold"
            >
              Register
            </button>
            <button
              type="button"
              className="btn bg-gray-500 hover:bg-gray-600 text-white w-full py-2 rounded-md transition-colors duration-300 font-semibold"
              onClick={() => setIsReg(false)}
            >
              Back to Login
            </button>
          </form>
        </div>
      ) : (
        <div className="relative w-screen h-screen overflow-hidden flex justify-center items-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30"></div>
          <img
            src={masterimg}
            alt="Master Logo"
            className="img-fluid mb-2 absolute z-0 w-full h-full object-scale-down opacity-90 transform hover:scale-105 transition-transform duration-700"
          />
          <form
            onSubmit={handleLogin}
            className="w-96 h-fit p-4 bg-white bg-opacity-40 backdrop-blur-md rounded shadow-md border border-gray-500 mx-auto mt-5 z-50 flex flex-col absolute"
          >
            <h2 className="text-center mb-2 text-2xl font-bold text-gray-800">
              Master Login
            </h2>
            <div className="mb-2">
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Email:
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control w-full px-4 py-2 rounded-md border shadow-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Enter Email"
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control w-full px-4 py-2 rounded-md border shadow-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Enter password"
                required
              />
            </div>
            <div className="flex flex-row items-center justify-between gap-5 mt-3">
              <button
                type="submit"
                className="btn bg-blue-600 hover:bg-blue-700 text-white w-full py-2 shadow-md rounded-md transition-colors duration-300 font-semibold"
              >
                Login
              </button>
              <button
                type="button"
                className="btn bg-gray-500 hover:bg-gray-600 text-white w-full py-2 shadow-md rounded-md transition-colors duration-300 font-semibold"
                onClick={() => setIsReg(true)}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MasterLogin;
