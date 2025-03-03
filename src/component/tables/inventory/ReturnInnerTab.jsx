import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../utilities/AxiosInstance";
import CreatableSelect from "react-select/creatable";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const ReturnInnerTab = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const clinicId = user?.u_vClinicId || "";
  const [companyNames, setCompanyNames] = useState([]);
  const [supplierNames, setSupplierNames] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState(null);
  const [selectedSupplierName, setSelectedSupplierName] = useState(null);
  const [selectedMaterialName, setSelectedMaterialName] = useState(null);
  const [materialName, setMaterialName] = useState([]);
  const [materialSize, setMaterialSize] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [currentMaterial, setCurrentMaterial] = useState({
    rem_vMaterial_Name: "",
    rem_vMaterial_Size: "",
    rem_iReturn_Units: "",
    rem_iUnit_Amount: "",
    rem_iTotal_Return_Amount: "",
  });
  const [formData, setFormData] = useState({
    res_vClinicID: clinicId,
    res_vCompany_Name: "",
    res_vSupplier_Name: "",
    res_dReturn_Date: new Date().toISOString().split("T")[0],
    res_iTotal_Return_Items: "",
    res_iTotal_Return_Amount: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMaterialInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMaterial(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "rem_iReturn_Units" || name === "rem_iUnit_Amount") {
        const units = parseFloat(updated.rem_iReturn_Units) || 0;
        const amount = parseFloat(updated.rem_iUnit_Amount) || 0;
        updated.rem_iTotal_Return_Amount = (units * amount).toString();
      }
      return updated;
    });
  };

  const addMaterial = () => {
    if (!currentMaterial.rem_vMaterial_Name || !currentMaterial.rem_vMaterial_Size) {
      message.error("Please fill in all material fields");
      return;
    }
    setMaterialsList(prev => [...prev, { ...currentMaterial, id: Date.now() }]);
    setCurrentMaterial({
      rem_vMaterial_Name: "",
      rem_vMaterial_Size: "",
      rem_iReturn_Units: "",
      rem_iUnit_Amount: "",
      rem_iTotal_Return_Amount: "",
    });
    calculateTotals([...materialsList, currentMaterial]);
  };

  const calculateTotals = (materials) => {
    const totalItems = materials.reduce(
      (sum, material) => sum + (parseFloat(material.rem_iReturn_Units) || 0),
      0
    );
    const totalAmount = materials.reduce(
      (sum, material) => sum + (parseFloat(material.rem_iTotal_Return_Amount) || 0),
      0
    );
    setFormData(prev => ({
      ...prev,
      res_iTotal_Return_Items: totalItems.toString(),
      res_iTotal_Return_Amount: totalAmount.toString(),
    }));
  };

  const getCompanyName = async () => {
    try {
      const response = await AxiosInstance.get(
        `/supplier/get-company/${user?.u_vClinicId || ""}`
      );
      setCompanyNames(response?.data?.response || []);
    } catch (error) {
      console.error("Error fetching company name:", error);
    }
  };

  const deleteMaterial = (id) => {
    const updatedMaterials = materialsList.filter(material => material.id !== id);
    setMaterialsList(updatedMaterials);
    calculateTotals(updatedMaterials);
  };

  const getSupplierName = async () => {
    try {
      if (!selectedCompanyName) return;
      const response = await AxiosInstance.get(
        `/supplier/get-supplier/${selectedCompanyName}`
      );
      setSupplierNames(response?.data?.response || []);
    } catch (error) {
      console.error("Error fetching supplier name:", error);
    }
  };

  const editMaterial = (material) => {
    setCurrentMaterial(material);
    deleteMaterial(material.id);
  };

  const getMaterialName = async () => {
    try {
      if (!selectedCompanyName || !selectedSupplierName) return;
      const response = await AxiosInstance.post(`/stock/get-materialnames`, {
        stm_vClinicID: user?.u_vClinicId || "",
        stm_vCompany_Name: selectedCompanyName,
        stm_vSupplier_Name: selectedSupplierName,
      });
      setMaterialName(response?.data?.response || []);
    } catch (error) {
      console.error("Error fetching material names:", error);
    }
  };

  const getMaterialSize = async () => {
    try {
      if (!selectedCompanyName || !selectedSupplierName || !materialName)
        return;
      const response = await AxiosInstance.post(`/stock/get-materialsize`, {
        stm_vClinicID: user?.u_vClinicId || "",
        stm_vCompany_Name: selectedCompanyName,
        stm_vSupplier_Name: selectedSupplierName,
        stm_vMaterial_Name: selectedMaterialName,
      });
      setMaterialSize(response?.data?.response || []);
    } catch (error) {
      console.error("Error fetching material size:", error);
      return [];
    }
  };

  useEffect(() => {
    getCompanyName();
  }, []);

  useEffect(() => {
    getSupplierName();
  }, [selectedCompanyName]);

  useEffect(() => {
    getMaterialName();
  }, [selectedCompanyName, selectedSupplierName]);

  useEffect(() => {
    getMaterialSize();
  }, [selectedCompanyName, selectedSupplierName, selectedMaterialName]);

  const handleSubmit = async () => {
    console.log(formData,materialsList);
    
    try {
      if (
        !formData.res_vClinicID ||
        !formData.res_vCompany_Name ||
        !formData.res_vSupplier_Name ||
        !formData.res_dReturn_Date
      ) {
        alert("Please fill in all required fields");
        return;
      }

      if (materialsList.length === 0) {
        alert("Please add at least one material");
        return;
      }

      const submitData = {
        ...formData,
        materials: materialsList
      };

      const response = await AxiosInstance.post(
        "returnstock/create-return-stock",
        submitData
      );
      console.log(response);
      message.success(response.data.message);
      navigate(-1);
      setFormData({
        res_vClinicID: clinicId,
        res_vCompany_Name: "",
        res_vSupplier_Name: "",
        res_dReturn_Date: "",
        res_iTotal_Return_Items: "",
        res_iTotal_Return_Amount: "",
      });
      setMaterialsList([]);
      setSelectedCompanyName(null);
      setSelectedSupplierName(null);
    } catch (error) {
      console.error("Error creating return stock:", error);
      alert("Error creating return stock. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <button onClick={()=>navigate(-1)} className="bg-[--navbar-bg-color] text-[--light-navbar-bg-color] px-2 py-1 rounded hover:bg-[--light-navbar-bg-color] hover:text-[--navbar-bg-color] duration-150 w-fit flex items-center gap-2">
          <IoArrowBack />Back
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Keep the existing form fields */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <CreatableSelect
              isClearable
              options={companyNames.map((name) => ({
                value: name,
                label: name,
              }))}
              name="res_vCompany_Name"
              value={
                formData.res_vCompany_Name
                  ? {
                      value: formData.res_vCompany_Name,
                      label: formData.res_vCompany_Name,
                    }
                  : null
              }
              onChange={(newValue) => {
                setSelectedCompanyName(newValue ? newValue.value : null);
                setFormData((prev) => ({
                  ...prev,
                  res_vCompany_Name: newValue ? newValue.value : "",
                }));
              }}
              className="w-full"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Name
            </label>
            <CreatableSelect
              isClearable
              options={supplierNames.map((name) => ({
                value: name,
                label: name,
              }))}
              name="res_vSupplier_Name"
              value={
                formData.res_vSupplier_Name
                  ? {
                      value: formData.res_vSupplier_Name,
                      label: formData.res_vSupplier_Name,
                    }
                  : null
              }
              onChange={(newValue) => {
                setSelectedSupplierName(newValue ? newValue.value : null);
                setFormData((prev) => ({
                  ...prev,
                  res_vSupplier_Name: newValue ? newValue.value : "",
                }));
              }}
              className="w-full"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Date
            </label>
            <input
              type="date"
              name="res_dReturn_Date"
              value={formData.res_dReturn_Date || new Date().toISOString().split("T")[0]}
              className="border p-2 w-full rounded"
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Return Items
            </label>
            <input
              type="number"
              name="res_iTotal_Return_Items"
              value={formData.res_iTotal_Return_Items}
              placeholder="Total Return Items"
              className="border p-2 w-full rounded bg-gray-100"
              onChange={handleInputChange}
              disabled
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Return Amount
            </label>
            <input
              type="number"
              name="res_iTotal_Return_Amount"
              value={formData.res_iTotal_Return_Amount}
              placeholder="Total Return Amount"
              className="border p-2 w-full rounded bg-gray-100"
              onChange={handleInputChange}
              disabled
            />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-bold mb-2">Add Material</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material Name
              </label>
              <CreatableSelect
                isClearable
                options={materialName.map((name) => ({
                  value: name || "",
                  label: name || "",
                }))}
                value={
                  currentMaterial.rem_vMaterial_Name
                    ? {
                        value: currentMaterial.rem_vMaterial_Name,
                        label: currentMaterial.rem_vMaterial_Name,
                      }
                    : null
                }
                onChange={(newValue) => {
                  setSelectedMaterialName(newValue ? newValue.value : null);
                  setCurrentMaterial(prev => ({
                    ...prev,
                    rem_vMaterial_Name: newValue ? newValue.value : "",
                  }));
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material Size
              </label>
              <CreatableSelect
                isClearable
                options={materialSize.map((name) => ({
                  value: name || "",
                  label: name || "",
                }))}
                value={
                  currentMaterial.rem_vMaterial_Size
                    ? {
                        value: currentMaterial.rem_vMaterial_Size,
                        label: currentMaterial.rem_vMaterial_Size,
                      }
                    : null
                }
                onChange={(newValue) => {
                  setCurrentMaterial(prev => ({
                    ...prev,
                    rem_vMaterial_Size: newValue ? newValue.value : "",
                  }));
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return Units
              </label>
              <input
                type="number"
                name="rem_iReturn_Units"
                value={currentMaterial.rem_iReturn_Units}
                onChange={handleMaterialInputChange}
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Amount
              </label>
              <input
                type="number"
                name="rem_iUnit_Amount"
                value={currentMaterial.rem_iUnit_Amount}
                onChange={handleMaterialInputChange}
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Return Amount
              </label>
              <input
                type="number"
                name="rem_iTotal_Return_Amount"
                value={currentMaterial.rem_iTotal_Return_Amount}
                className="border p-2 w-full rounded bg-gray-100"
                disabled
              />
            </div>
          </div>
          <button
            onClick={addMaterial}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Add Material
          </button>
        </div>

        {materialsList.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Materials List</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="border p-2">Material Name</th>
                    <th className="border p-2">Material Size</th>
                    <th className="border p-2">Return Units</th>
                    <th className="border p-2">Unit Amount</th>
                    <th className="border p-2">Total Return Amount</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materialsList.map((material) => (
                    <tr key={material.id}>
                      <td className="border p-2">{material.rem_vMaterial_Name}</td>
                      <td className="border p-2">{material.rem_vMaterial_Size}</td>
                      <td className="border p-2">{material.rem_iReturn_Units}</td>
                      <td className="border p-2">{material.rem_iUnit_Amount}</td>
                      <td className="border p-2">{material.rem_iTotal_Return_Amount}</td>
                      <td className="border p-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editMaterial(material)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMaterial(material.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded w-fit"
        >
          Submit Return Stock
        </button>
      </div>
    </>
  );
};

export default ReturnInnerTab;