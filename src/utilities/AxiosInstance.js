import axios from "axios";

const AxiosInstance = axios.create({
  // baseURL: "http://localhost:7799",
  // baseURL: "https://svpc.qsisphysio.com/api",
  baseURL: "https://svpc-backend-v2gw.onrender.com" /*Render Link */,
});

export default AxiosInstance;
