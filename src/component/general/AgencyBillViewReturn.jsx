import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AgencyBillViewReturn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    br_vID: "",
    br_vPatient_Id: "",
    br_vClinicID: "",
    br_vDateTime: "",
    br_iTotal_Return_Amount: 0,
    materials: {
      brm_vID: "",
      brm_vBill_ReturnId: "",
      brm_vPatient_Id: "",
      brm_vClinicID: "",
      brm_vSupplier_Name: "",
      brm_vCompany_Name: "",
      brm_vMaterial_Name: "",
      bmr_iMaterial_Size: "",
      brm_iUnit_Amount: 0,
      brm_iSeal_Units: 0,
      brm_iReturn_Units: 0,
      brm_iTotal_Return_Amount: 0,
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      materials: {
        ...prevState.materials,
        [name]: value,
      },
    }));
  };
  return (
    <div>
      <button
        className="bg-[--navbar-bg-color] text-[--light-navbar-bg-color] hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-150 py-1 px-4 rounded"
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </button>
      <form className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Return Form</h2>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Bill Return ID:
          </label>
          <input
            type="text"
            name="br_vID"
            value={formData.br_vID}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Patient ID:
          </label>
          <input
            type="text"
            name="br_vPatient_Id"
            value={formData.br_vPatient_Id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Clinic ID:
          </label>
          <input
            type="text"
            name="br_vClinicID"
            value={formData.br_vClinicID}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Date & Time:
          </label>
          <input
            type="datetime-local"
            name="br_vDateTime"
            value={formData.br_vDateTime}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Total Return Amount:
          </label>
          <input
            type="number"
            name="br_iTotal_Return_Amount"
            value={formData.br_iTotal_Return_Amount}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-700">
          Material Details
        </h3>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Material ID:
          </label>
          <input
            type="text"
            name="brm_vID"
            value={formData.materials.brm_vID}
            onChange={handleMaterialChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Bill Return ID:
          </label>
          <input
            type="text"
            name="brm_vBill_ReturnId"
            value={formData.materials.brm_vBill_ReturnId}
            onChange={handleMaterialChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Supplier Name:
          </label>
          <input
            type="text"
            name="brm_vSupplier_Name"
            value={formData.materials.brm_vSupplier_Name}
            onChange={handleMaterialChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Company Name:
          </label>
          <input
            type="text"
            name="brm_vCompany_Name"
            value={formData.materials.brm_vCompany_Name}
            onChange={handleMaterialChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Material Name:
          </label>
          <input
            type="text"
            name="brm_vMaterial_Name"
            value={formData.materials.brm_vMaterial_Name}
            onChange={handleMaterialChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Material Size:
          </label>
          <input
            type="text"
            name="bmr_iMaterial_Size"
            value={formData.materials.bmr_iMaterial_Size}
            onChange={handleMaterialChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Unit Amount:
          </label>
          <input
            type="number"
            name="brm_iUnit_Amount"
            value={formData.materials.brm_iUnit_Amount}
            onChange={handleMaterialChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Seal Units:
          </label>
          <input
            type="number"
            name="brm_iSeal_Units"
            value={formData.materials.brm_iSeal_Units}
            onChange={handleMaterialChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Return Units:
          </label>
          <input
            type="number"
            name="brm_iReturn_Units"
            value={formData.materials.brm_iReturn_Units}
            onChange={handleMaterialChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">
            Total Return Amount:
          </label>
          <input
            type="number"
            name="brm_iTotal_Return_Amount"
            value={formData.materials.brm_iTotal_Return_Amount}
            onChange={handleMaterialChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AgencyBillViewReturn;
