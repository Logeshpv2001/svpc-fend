import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../utilities/AxiosInstance";

function SelasHistory() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinic_id = user.u_vClinicId;
  const [allSeals, setAllSeals] = useState([]);

  const getMaterialData = async () => {
    try {
      const response = await AxiosInstance.get(`seals/get-all/${clinic_id}`);
      setAllSeals(response?.data?.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMaterialData();
  }, []);

  return (
    <div className="overflow-auto rounded-md shadow-md">
      {" "}
      {allSeals?.length > 0 ? (
        <table className="overflow-auto text-nowrap text-center w-full">
          <thead>
            <tr className="bg-[--navbar-bg-color] text-white font-bold">
              <th className="px-4 py-2 sticky left-0 bg-[--navbar-bg-color] border-r border-white">
                S.no
              </th>
              <th className="px-4 py-2">Company Name</th>
              <th className="px-4 py-2">Supplier Name</th>
              <th className="px-4 py-2">Material Name</th>
              <th className="px-4 py-2">Material Size</th>
              <th className="px-4 py-2">Total Seals Count</th>
              <th className="px-4 py-2">Total Seals Amount</th>
            </tr>
          </thead>
          <tbody className="overflow-auto divide-y divide-gray-200">
            {allSeals?.map((data, index) => (
              <tr key={index + 1} className="hover:bg-gray-100">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{data?.sh_vCompany_Name}</td>
                <td className="px-4 py-2">{data?.sh_vSupplier_Name}</td>
                <td className="px-4 py-2">{data?.sh_vMaterial_Name}</td>
                <td className="px-4 py-2">{data?.sh_vMaterial_Size}</td>
                <td className="px-4 py-2">{data?.sh_iTotal_Seal_Items}</td>
                <td className="px-4 py-2">{data?.sh_iTotal_Seal_Amount}</td>
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
            No Seals Found
          </h1>
        </div>
      )}
    </div>
  );
}

export default SelasHistory;
