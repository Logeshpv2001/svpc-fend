import React, { useEffect, useState } from "react";
import { FaWarehouse } from "react-icons/fa";
import { Modal, message } from "antd";
import AxiosInstance from "../../../utilities/AxiosInstance";
import { use } from "react";
import SupplierTable from "./SupplierTable";

const initialState = {
  sup_vCompany_Name: "",
  sup_vCompany_phone: "",
  sup_vSupplier_Name: "",
  sup_vSupplier_Phone: "",
};
function SuppliersInnerTab() {
  const [showModal, setShowModal] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinic_id = user.u_vClinicId;
  const [formData, setFormData] = useState(initialState);

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const payload = {
    ...formData,
    sup_vClinicID: clinic_id,
  };

  const handleSubmit = async () => {
    try {
      const response = await AxiosInstance.post(
        "/supplier/new-supplier",
        payload
      );
      if (response.data.status == 201) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }

      setFormData(initialState);
    } catch (error) {
      message.error("Failed to add stocks");
      console.log(error);
    }
    setShowModal(false);
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5 items-center">
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-[--navbar-bg-color] text-white hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] rounded duration-200 px-3 py-1"
        >
          <FaWarehouse size={18} />
          <h1 className="h-full m-0">Add Supplier</h1>
        </button>
      </div>
      
      <div>
        <SupplierTable handleSubmit={handleSubmit} />
      </div>

      <Modal
        title="Add Stocks"
        open={showModal}
        onCancel={handleCancel}
        footer={false}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Company Name</label>
            <input
              type="text"
              name="sup_vCompany_Name"
              value={formData.sup_vCompany_Name}
              onChange={handleChange}
              placeholder="Enter Company Name"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Company Phone Number</label>
            <input
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              name="sup_vCompany_phone"
              value={formData.sup_vCompany_phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange({
                  target: {
                    name: e.target.name,
                    value: value,
                  },
                });
              }}
              placeholder="Enter Phone Number"
              className="w-full p-2 border border-gray-300 rounded-md"
            />{" "}
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Supplier Name</label>
            <input
              type="text"
              name="sup_vSupplier_Name"
              value={formData.sup_vSupplier_Name}
              onChange={handleChange}
              placeholder="Enter Supplier Name"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Supplier Phone Number</label>
            <input
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              name="sup_vSupplier_Phone"
              value={formData.sup_vSupplier_Phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange({
                  target: {
                    name: e.target.name,
                    value: value,
                  },
                });
              }}
              placeholder="Enter Supplier Phone Number"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full mt-4"
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default SuppliersInnerTab;
