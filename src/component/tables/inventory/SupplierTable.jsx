import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { message, Modal } from "antd";

function SupplierTable({handleSubmit}) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinic_id = user.u_vClinicId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    companyPhone: "",
    supplierName: "",
    supplierPhone: "",
  });

  const [allSuppliers, setAllSuppliers] = useState([]);

  const getSupplierData = async () => {
    try {
      const response = await AxiosInstance.get(
        `/supplier/get-all/${clinic_id}`
      );
      setAllSuppliers(response.data.response);
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };

  useEffect(() => {
    getSupplierData();
  }, [handleSubmit]);

  const handleDelete = async (id) => {
    try {
      const response = await AxiosInstance.patch(
        `/supplier/delete-supplier/${id}`
      );
      if (response.data.status === 200) {
        message.success(response.data.message);
        getSupplierData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (item) => {
    setSelectedSupplier(item);
    setFormData({
      companyName: item.sup_vCompany_Name,
      companyPhone: item.sup_vCompany_phone,
      supplierName: item.sup_vSupplier_Name,
      supplierPhone: item.sup_vSupplier_Phone,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOk = async () => {
    try {
      const response = await AxiosInstance.patch(
        `/supplier/update-supplier/${selectedSupplier.sup_vID}`,
        {
          sup_vClinicID: clinic_id,
          sup_vCompany_Name: formData.companyName,
          sup_vCompany_phone: formData.companyPhone,
          sup_vSupplier_Name: formData.supplierName,
          sup_vSupplier_Phone: formData.supplierPhone,
        }
      );
      if (response.data.status === 200) {
        message.success(response.data.message);
        setIsModalOpen(false);
        setFormData({
          companyName: "",
          companyPhone: "",
          supplierName: "",
          supplierPhone: "",
        });
        getSupplierData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({
      companyName: "",
      companyPhone: "",
      supplierName: "",
      supplierPhone: "",
    });
  };

  return (
    <div className="overflow-scroll rounded-md shadow-md border">
      {allSuppliers?.length > 0 ? (
      <table className="overflow-scroll text-nowrap text-center w-full">
        <thead>
          <tr className="bg-[--navbar-bg-color] text-white font-bold">
            <th className="px-4 py-2 sticky left-0 bg-[--navbar-bg-color] border-r border-white">
              S.no
            </th>
            <th className="px-4 py-2">Supplier Id</th>
            <th className="px-4 py-2">Company Name</th>
            <th className="px-4 py-2">Company Phone Number</th>
            <th className="px-4 py-2">Supplier Name</th>
            <th className="px-4 py-2">Supplier Phone Number</th>
            <th className="px-4 py-2  bg-[--navbar-bg-color] border-l border-white">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="overflow-auto divide-y divide-gray-200">
          {allSuppliers?.map((item, index) => {
            return (
              <tr key={index}>
                <td className=" px-4 py-2 sticky left-0 bg-slate-100">
                  {index + 1}
                </td>
                <td className="px-4 py-2">{item.sup_vID}</td>
                <td className="px-4 py-2">{item.sup_vCompany_Name}</td>
                <td className="px-4 py-2">{item.sup_vCompany_phone}</td>
                <td className="px-4 py-2">{item.sup_vSupplier_Name}</td>
                <td className="px-4 py-2">{item.sup_vSupplier_Phone}</td>
                <td className="px-4 py-2 ">
                  <div className="flex flex-row justify-evenly gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.sup_vID)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="animate-bounce mt-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-600 animate-pulse">No Suppliers Found</h1>
        </div>
      )}

      <Modal
        title="Edit Supplier Details"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <label>Company Phone Number</label>
          <input
            type="text"
            name="companyPhone"
            value={formData.companyPhone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Supplier Phone Number</label>
          <input
            type="text"
            name="supplierPhone"
            value={formData.supplierPhone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </Modal>
    </div>
  );
}

export default SupplierTable;
