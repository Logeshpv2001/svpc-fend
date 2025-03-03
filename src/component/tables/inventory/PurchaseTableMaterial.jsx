import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { useNavigate } from "react-router-dom";
function PurchaseTableMaterial() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [purchaseData, setPurchaseData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);

  const getMaterialData = async () => {
    try {
      const response = await AxiosInstance.get(
        `/inventories/get-materials/${id}`
      );
      setPurchaseData(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };
  const companyNames = async () => {
    try {
      const response = await AxiosInstance.get(`/supplier/get-company`);
      setSupplierData(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMaterialData();
    companyNames();
  }, []);
  return (
    <div>
      <h1>Materials</h1>
      <div className="flex items-center mb-3">
        <button
          className="bg-[--navbar-bg-color] text-white px-2 py-1 rounded hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-150 w-fit flex items-center"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      <div className="overflow-x-auto rounded-md shadow-md">
        <table className="overflow-auto text-nowrap text-center w-full">
          <thead>
            <tr className="bg-blue-500 text-white font-bold">
              <th className="px-4 py-2 sticky left-0 bg-blue-500 border-r border-white">
                S.no
              </th>
              <th className="px-4 py-2">Material Id</th>
              <th className="px-4 py-2">Material Name</th>
              <th className="px-4 py-2">Company Name</th>
              <th className="px-4 py-2">Supplier Name</th>
              <th className="px-4 py-2">Material Size</th>
              <th className="px-4 py-2">Material Quantity</th>
              <th className="px-4 py-2">Material Price (unit)</th>
              <th className="px-4 py-2">Material Total Price</th>
              <th className="px-4 py-2">Material Discount</th>
              <th className="px-4 py-2">Material GST Amount</th>
              <th className="px-4 py-2">Material GST Percentage</th>
              <th className="px-4 py-2">Material Total Price</th>
            </tr>
          </thead>
          <tbody>
            {purchaseData?.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 sticky left-0 bg-slate-50 border-r">
                  {index + 1}
                </td>
                <td className="px-4 py-2">{item.inm_vID}</td>
                <td className="px-4 py-2">{item.inm_vMaterial_Name}</td>
                <td className="px-4 py-2">{item.inm_vCompany_Name}</td>
                <td className="px-4 py-2">{item.inm_vSupplier_Name}</td>
                <td className="px-4 py-2">{item.inm_iMaterial_Size}</td>
                <td className="px-4 py-2">{item.inm_iTotal_Purchase_Units}</td>
                <td className="px-4 py-2">{item.inm_iUnit_Amount}</td>
                <td className="px-4 py-2">{item.inm_iTotal_Material_Amount}</td>
                <td className="px-4 py-2">{item.inm_iDiscount_Percentage}</td>
                <td className="px-4 py-2">{item.inm_iGST_Amount}</td>
                <td className="px-4 py-2">{item.inm_iGST_Percentage}</td>
                <td className="px-4 py-2">{item.inm_iTotal_Material_Amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PurchaseTableMaterial;
