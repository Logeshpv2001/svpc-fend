import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../utilities/AxiosInstance";

const StocksTable = () => {
  const [allStocks, setAllStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinic_id = user.u_vClinicId;

  const getSupplierData = async () => {
    try {
      const response = await AxiosInstance.get(`/stock/get-all/${clinic_id}`);
      setAllStocks(response.data.response);
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };

  useEffect(() => {
    getSupplierData();
  }, []);

  const filteredStocks = allStocks?.filter((stock) =>
    Object.values(stock).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search stocks..."
          className="w-full p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-auto w-full h-full rounded-md shadow-md">
        {filteredStocks?.length > 0 ? (
          <table className="overflow-auto text-nowrap text-center w-full">
            <thead>
            <tr className="bg-[--navbar-bg-color] text-white font-bold">
              <th className="px-4 py-2 sticky left-0 bg-[--navbar-bg-color] border-r border-white">
                S.no
              </th>
              <th className="px-4 py-2">Stock Id</th>
              <th className="px-4 py-2">Material Name</th>
              <th className="px-4 py-2">Material Size</th>
              <th className="px-4 py-2">Unit Amount</th>
              <th className="px-4 py-2">Material Total_Count</th>
              <th className="px-4 py-2">Supplier Name</th>
              <th className="px-4 py-2">Company Name </th>
            </tr>
          </thead>
          <tbody className="overflow-auto divide-y divide-gray-200">
            {filteredStocks?.map((stock, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{stock.stm_vID}</td>
                <td className="px-4 py-2">{stock.stm_vMaterial_Name}</td>
                <td className="px-4 py-2">{stock.stm_iMaterial_Size}</td>
                <td className="px-4 py-2">{stock.stm_iUnit_Amount}</td>
                <td className="px-4 py-2">{stock.stm_iMaterial_Total_Count}</td>
                <td className="px-4 py-2">{stock.stm_vSupplier_Name}</td>
                <td className="px-4 py-2">{stock.stm_vCompany_Name}</td>
              </tr>
            ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="animate-bounce mt-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-600 animate-pulse">No Stocks Found</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default StocksTable;