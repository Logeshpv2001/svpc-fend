import React, { useState } from "react";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { useNavigate } from "react-router-dom";
import svpc from "../../../assets/logo.jpg";
import qsis from "../../../assets/qsis.png";
import banner from "../../../assets/banner.jpg";
import { message } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false); // Toggle between Login and Register forms
  const [u_vClinicId, setClinicId] = useState("");
  const [u_vName, setName] = useState("");
  const [u_vPhone, setPhone] = useState("");
  const [u_vEmail, setEmail] = useState("");
  const [u_vPassword, setPassword] = useState("");
  const [u_tAddress, setAddress] = useState("");
  const [u_eRole, setRole] = useState("");

  const toggleForm = () => {
    setIsRegister(!isRegister);
    // navigate("/physio/today-patient");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      // Register Form Submission
      try {
        const response = await AxiosInstance.post("/user/user-register", {
          u_vClinicId,
          u_vName,
          u_vPhone,
          u_vEmail,
          u_vPassword,
          u_tAddress,
          u_eRole,
        });
        if (response.data.status === 201) {
          message.success(response.data.message);
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        message.error("Failed to register");
      }
    } else {
      // Login Form Submission
      try {
        const response = await AxiosInstance.post("/user/user-login", {
          u_vEmail,
          u_vPassword,
        });
        console.log(response);
        if (response.data.status === 200) {
          message.success(response.data.message);
          console.log(response);
        } else {
          message.error(response.data.message);
        }
        sessionStorage.setItem("user", JSON.stringify(response.data.response));
        if (response.data.status === 200) {
          if (response.data.response?.u_eRole === "receptionist") {
            navigate(
              `/${response.data.response?.u_eRole}/enquiry-registration`
            );
          } else {
            navigate(`/${response.data.response?.u_eRole}/view-patient`);
          }
        }
      } catch (error) {
        console.log(error);
        message.error("Failed to login");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full fixed inset-0 bg-slate-200 max-md:p-2">
      {/* Left Panel */}
      <div className="bg-[--navbar-bg-color] text-white flex flex-col justify-between max-md:hidden">
        <div className="my-6 flex justify-center">
          <img
            src={svpc}
            alt="clinic Logo"
            className="min-w-[350px] max-w-[200px] max-h-[150px] max-md:min-w-[100px] max-md:max-h-[100px]"
          />
        </div>
        <p className="w-11/12 mx-auto text-lg font-semibold text-center">
          Sri Venkateswara Physiotherapy Clinic is group of thematically-focused
          health and wellness clinics, providing evidence-based physiotherapy
          care.
        </p>
        <div>
          <img src={banner} alt="clinic banner" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col items-center justify-center">
        <div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded absolute top-5 right-5"
            onClick={() => navigate("/master-login")}
          >
            Master Login
          </button>
        </div>
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center mb-4">
            {isRegister ? "Register" : "Login"}
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Login Fields */}
            {!isRegister && (
              <>
                {/* <div className="mb-4">
                  <label
                    htmlFor="clinicId"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Clinic ID:
                  </label>
                  <input
                    type="text"
                    id="clinicId"
                    value={u_vClinicId}
                    onChange={(e) => setClinicId(e.target.value)}
                    placeholder="Enter your Clinic ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div> */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={u_vEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={u_vPassword}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div>
              </>
            )}

            {/* Register Fields */}
            {isRegister && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label
                      htmlFor="clinicId"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Clinic ID:
                    </label>
                    <input
                      type="text"
                      id="clinicId"
                      value={u_vClinicId}
                      onChange={(e) => setClinicId(e.target.value)}
                      placeholder="Enter your Clinic ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="fullname"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Full Name:
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      value={u_vName}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="phone"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Phone Number:
                    </label>
                    <input
                      type="text"
                      id="phone"
                      value={u_vPhone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="address"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Address:
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={u_tAddress}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="role"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Role:
                    </label>
                    <select
                      id="role"
                      value={u_eRole}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      <option value="receptionist">Receptionist</option>
                      <option value="physio">Physiotherapist</option>
                      <option value="centre head">Centre Head</option>
                      <option value="admin">Admin</option>
                      <option value="ceo">CEO</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={u_vEmail}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div className="mb-4 col-span-2">
                    <label
                      htmlFor="password"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={u_vPassword}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account yet?"}{" "}
            <button
              onClick={toggleForm}
              className="text-blue-600 font-medium hover:underline"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
          <div className="my-4 flex flex-col justify-center items-center">
            <p className="text-slate-500 font-medium">Powered by:</p>
            <div className="my-2">
              <img src={qsis} alt="qsis logo" className="w-56" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
