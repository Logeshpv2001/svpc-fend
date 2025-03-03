import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { useNavigate } from "react-router-dom";
import SwapReturnTable from "./SwapReturnTable";

const ReturnTable = () => {
  const navigate = useNavigate();
  const [returnData, setReturnData] = useState([]);
  const [materialID, setMaterialID] = useState();
  const [materialData, setMaterialData] = useState([]);
  const [swapContant, setSwapContant] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinic_id = user.u_vClinicId;

  const getReturnDate = async () => {
    try {
      const response = await AxiosInstance.get(
        `/returnstock/get-return-stock/${clinic_id}`
      );
      setReturnData(response.data.response || []);
      console.log(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  const getMaterialName = async () => {
    try {
      const response = await AxiosInstance.get(
        `returnstock/get-return-stockmatierials/${materialID}`
      );
      setMaterialData(response.data.response);
      console.log(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getReturnDate();
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day} / ${date.toLocaleTimeString()}`;
  };

  return (
    <div>
      {swapContant ? (
        <SwapReturnTable
          materialData={materialData}
          setSwapContant={setSwapContant}
        />
      ) : (
        <div>
          <button
            onClick={() => navigate("/receptionist/purchase/return")}
            className="bg-[--navbar-bg-color] text-[--light-navbar-bg-color] mb-4 px-2 py-1 rounded hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-150 w-fit flex items-center gap-2"
          >
            Return Stock
          </button>
          <div className="overflow-auto max-h-[400px] text-nowrap text-center rounded-md shadow-md">
            {returnData?.length > 0 ? (
              <table className="overflow-auto text-nowrap text-center w-full">
                <thead>
                  <tr className="bg-[--navbar-bg-color] text-white font-bold">
                    <th className="px-4 py-2 sticky left-0 bg-[--navbar-bg-color] border-r border-white">
                      S.no
                    </th>
                    <th className="px-4 py-2">Date / Time</th>
                    <th className="px-4 py-2">Company Name</th>
                    <th className="px-4 py-2">Supplier Name</th>
                    <th className="px-4 py-2">Total Return Amount</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="overflow-auto divide-y divide-gray-200">
                  {returnData?.map((data, index) => (
                    <tr key={index + 1} className="hover:bg-gray-100">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">
                        {formatDate(data?.res_dReturn_Date)}
                      </td>
                      <td className="px-4 py-2">{data?.res_vCompany_Name}</td>
                      <td className="px-4 py-2">{data?.res_vSupplier_Name}</td>
                      <td className="px-4 py-2">
                        {data?.res_iTotal_Return_Amount}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setMaterialID(data?.res_vID);
                              getMaterialName();
                              setSwapContant(true);
                            }}
                            className="bg-[--navbar-bg-color] text-[--light-navbar-bg-color] px-2 py-1 rounded hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-150 w-fit flex items-center gap-2"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="animate-bounce mt-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-600 animate-pulse">
                  No Return Found
                </h1>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnTable;
