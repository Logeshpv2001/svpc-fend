import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../utilities/AxiosInstance";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { message } from "antd";

function PurchaseCreate() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const clinicId = user.u_vClinicId;
  const name = user.u_vName;
  console.log(name);
  const [totalPayableAmount, setTotalPayableAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [gstAmount, setGSTAmount] = useState(0);

  console.log(totalPayableAmount, "totalPayableAmount");
  const [companyNames, setCompanyNames] = useState([]);
  const [supplierName, setSupplierName] = useState([]);
  const [materialName, setMaterialName] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState(null);
  const [materialSize, setMaterialSize] = useState([]);
  const [selectedMaterialName, setSelectedMaterialName] = useState(null);
  const [materialForms, setMaterialForms] = useState([0]);
  const [formData, setFormData] = useState({
    in_vCompany_Name: "",
    in_vSupplier_Name: "",
    in_vBill_No: "",
    in_dPurchase_Date: new Date().toISOString().split('T')[0],
    in_iMaterial_Count: "",
    in_iTotal_Amount: "",
    in_iDiscount_Amount: "",
    in_iGST_Amount: "",
    in_iTotal_Payable_Amount: "",
    in_iTotal_Paid_Amount: "",
    in_iRecived_by: name,
    material: [],
  });

  const [material, setMaterial] = useState([
    {
      inm_vMaterial_Name: "",
      inm_iTotal_Purchase_Units: "",
      inm_iTotal_Material_Amount: "",
      inm_iUnit_Amount: "",
      inm_iDiscount_Percentage: "",
      inm_iDiscount_Amount: "",
      inm_iGST_Percentage: "",
      inm_iGST_Amount: "",
      inm_iMaterial_Size: "",
      inm_iTotal_Payable_Amount: "",
    },
  ]);

  const [submittedMaterials, setSubmittedMaterials] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const getCompanyName = async () => {
    try {
      const response = await AxiosInstance.get(
        `/supplier/get-company/${user?.u_vClinicId}`
      );
      setCompanyNames(response?.data?.response || []);
    } catch (error) {
      console.error("Error fetching company name:", error);
    }
  };

  const getSupplierName = async () => {
    try {
      if (!selectedCompanyName) return;
      const response = await AxiosInstance.get(
        `/supplier/get-supplier/${selectedCompanyName}`
      );
      setSupplierName(response?.data?.response || []);
    } catch (error) {
      console.error("Error fetching supplier name:", error);
    }
  };

  const getMaterialName = async () => {
    try {
      const response = await AxiosInstance.get(
        `/stock/get-materialnames/${user.u_vClinicId}`
      );
      setMaterialName(response?.data?.response || []);
    } catch (error) {
      console.error("Error fetching company name:", error);
    }
  };

  const getMaterialSize = async () => {
    try {
      const response = await AxiosInstance.get(
        `/stock/get-materialsize/${selectedMaterialName}`
      );
      setMaterialSize(response?.data?.response || []);
    } catch (error) {
      console.error("Error fetching company name:", error);
    }
  };

  useEffect(() => {
    getCompanyName();
    getMaterialName();
  }, []);

  useEffect(() => {
    getSupplierName();
  }, [selectedCompanyName]);

  useEffect(() => {
    getMaterialSize();
  }, [selectedMaterialName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMaterialChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMaterials = [...material];

    if (
      [
        "inm_iTotal_Purchase_Units",
        "inm_iUnit_Amount",
        "inm_iDiscount_Percentage",
        "inm_iGST_Percentage",
      ].includes(name)
    ) {
      updatedMaterials[index][name] = parseFloat(value) || 0;
    } else {
      updatedMaterials[index][name] = value;
    }

    const unitAmount =
      parseFloat(updatedMaterials[index]?.inm_iUnit_Amount) || 0;
    const totalUnits =
      parseFloat(updatedMaterials[index]?.inm_iTotal_Purchase_Units) || 0;
    const discountPercentage =
      parseFloat(updatedMaterials[index]?.inm_iDiscount_Percentage) || 0;
    const gstPercentage =
      parseFloat(updatedMaterials[index]?.inm_iGST_Percentage) || 0;

    const totalMaterialAmount = unitAmount * totalUnits;
    const discountAmount = (totalMaterialAmount * discountPercentage) / 100;
    const gstAmount =
      ((totalMaterialAmount - discountAmount) * gstPercentage) / 100;
    const payableAmount = totalMaterialAmount - discountAmount + gstAmount;

    updatedMaterials[index] = {
      ...updatedMaterials[index],
      inm_iTotal_Material_Amount: totalMaterialAmount,
      inm_iDiscount_Amount: discountAmount,
      inm_iGST_Amount: gstAmount,
      inm_iTotal_Payable_Amount: payableAmount,
    };

    setMaterial(updatedMaterials);
    console.log(updatedMaterials, "updatedMaterials");
    calculateTotals(updatedMaterials);
  };

  const calculateTotals = (materials) => {
    const totalAmount = materials.reduce(
      (sum, mat) => sum + (mat.inm_iTotal_Material_Amount || 0),
      0
    );
    const totalDiscount = materials.reduce(
      (sum, mat) => sum + (mat.inm_iDiscount_Amount || 0),
      0
    );
    const totalGST = materials.reduce(
      (sum, mat) => sum + (mat.inm_iGST_Amount || 0),
      0
    );
    const totalPayable = materials.reduce(
      (sum, mat) => sum + (mat.inm_iTotal_Payable_Amount || 0),
      0
    );

    setFormData((prevData) => ({
      ...prevData,
      in_iTotal_Amount: totalAmount,
    }));
  };

  const handleAddMaterial = () => {
    setTotalPayableAmount(
      (prevTotal) => prevTotal + material[0].inm_iTotal_Payable_Amount
    );
    setDiscountAmount(
      (prevTotal) => prevTotal + material[0].inm_iDiscount_Amount
    );
    setGSTAmount((prevTotal) => prevTotal + material[0].inm_iGST_Amount);

    if (editIndex !== null) {
      const updatedMaterials = [...submittedMaterials];
      updatedMaterials[editIndex] = material[0];
      setSubmittedMaterials(updatedMaterials);
      // setFormData((prevData) => ({
      //   ...prevData,
      //   in_iDiscount_Amount: discountAmount,
      //   in_iGST_Amount: gstAmount,
      //   in_iTotal_Payable_Amount: totalPayableAmount,
      // }));
      log(formData, "formData");
      setEditIndex(null);
    } else {
      setSubmittedMaterials([...submittedMaterials, material[0]]);
    }

    setMaterial([
      {
        inm_vMaterial_Name: "",
        inm_iTotal_Purchase_Units: "",
        inm_iTotal_Material_Amount: "",
        inm_iUnit_Amount: "",
        inm_iDiscount_Percentage: "",
        inm_iDiscount_Amount: "",
        inm_iGST_Percentage: "",
        inm_iGST_Amount: "",
        inm_iMaterial_Size: "",
        inm_iTotal_Payable_Amount: "",
      },
    ]);
  };

  const handleEditMaterial = (index) => {
    setMaterial([submittedMaterials[index]]);
    setEditIndex(index);
  };

  const handleDeleteMaterial = (index) => {
    const updatedMaterials = submittedMaterials.filter((_, i) => i !== index);
    setSubmittedMaterials(updatedMaterials);
  };

  const createPurchase = async () => {
    const payload = {
      ...formData,
      in_vClinicID: clinicId,
      material: submittedMaterials,
      in_iMaterial_Count: submittedMaterials.length,
      in_iDiscount_Amount: discountAmount,
      in_iGST_Amount: gstAmount,
      in_iTotal_Payable_Amount: totalPayableAmount,
    };
    console.log(payload, "payload");
    
    try {
      const response = await AxiosInstance.post("/inventories/create", payload);
      console.log(response);
      if (response.data.status === 201) {
        message.success(response.data.message);
        navigate(-1);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating purchase:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-5">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Purchase Create</h1>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-wrap justify-stretch gap-5 border">
        <div className="min-w-72 gap-2 flex flex-col">
          <label>Company Name</label>
          <CreatableSelect
            isClearable
            options={companyNames.map((name, index) => ({
              value: name,
              label: name,
            }))}
            name="in_vCompany_Name"
            value={
              formData.in_vCompany_Name
                ? {
                    value: formData.in_vCompany_Name,
                    label: formData.in_vCompany_Name,
                  }
                : null
            }
            onChange={(newValue) => {
              setSelectedCompanyName(newValue ? newValue.value : null);
              setFormData((prev) => ({
                ...prev,
                in_vCompany_Name: newValue ? newValue.value : null,
              }));
            }}
            className="min-w-72"
          />
        </div>
        <div className="min-w-72 gap-2 flex flex-col">
          <label htmlFor="">Supplier Name</label>
          <CreatableSelect
            isClearable
            options={supplierName.map((name, index) => ({
              value: name,
              label: name,
            }))}
            name="in_vSupplier_Name"
            value={
              formData.in_vSupplier_Name
                ? {
                    value: formData.in_vSupplier_Name,
                    label: formData.in_vSupplier_Name,
                  }
                : null
            }
            onChange={(newValue) => {
              setFormData((prev) => ({
                ...prev,
                in_vSupplier_Name: newValue ? newValue.value : null,
              }));
            }}
            className="max-w-72"
          />
        </div>
        <div className="max-w-72 flex flex-col gap-2">
          <label htmlFor="">Bill Number</label>
          <input
            type="text"
            name="in_vBill_No"
            placeholder="Bill Number"
            value={formData.in_vBill_No}
            onChange={handleInputChange}
            className="border border-neutral-300 min-w-72 h-[38.5px] rounded px-3"
          />
        </div>
        <div className="max-w-72 gap-2 flex flex-col">
          <label htmlFor="">Purchase Date</label>
          <input
            type="date"
            name="in_dPurchase_Date"
            placeholder="Purchase Date"
            value={formData.in_dPurchase_Date || new Date().toISOString().split('T')[0]}
            onChange={handleInputChange}
            className="border border-neutral-300 min-w-72 h-[38.5px] rounded px-3"
          />
        </div>
        <div className="max-w-72 gap-2 flex flex-col">
          <label htmlFor="">Material Count</label>
          <input
            type="number"
            name="in_iMaterial_Count"
            placeholder="Material Count"
            value={submittedMaterials.length}
            onChange={handleInputChange}
            className="border border-neutral-300 min-w-72 h-[38.5px] rounded px-3"
          />
        </div>
        <div className="max-w-72 gap-2 flex-col hidden">
          <label htmlFor="">Total Amount</label>
          <input
            type="number"
            name="in_iTotal_Amount"
            placeholder="Total Amount"
            value={formData.in_iTotal_Amount}
            onChange={handleInputChange}
            className="border border-neutral-300 min-w-72 h-[38.5px] rounded px-3"
          />
        </div>
        <div className="max-w-72 gap-2 flex flex-col">
          <label htmlFor="">Total Discount Amount</label>
          <input
            type="number"
            name="in_iDiscount_Amount"
            placeholder="Discount Amount"
            value={formData.in_iDiscount_Amount}
            onChange={handleInputChange}
            className="border border-neutral-300 min-w-72 h-[38.5px] rounded px-3 hidden"
          />
          <p className="border border-neutral-300 min-w-72 h-[38.5px] rounded px-3 flex items-center">{discountAmount}</p>
        </div>
        <div className="max-w-72 gap-2 flex flex-col">
          <label htmlFor="">GST Amount</label>
          <input
            type="number"
            name="in_iGST_Amount"
            placeholder="GST Amount"
            value={formData.in_iGST_Amount}
            onChange={handleInputChange}
            className="border border-neutral-300 min-w-72 h-[38.5px] rounded px-3 hidden"
          />
          <p className="border border-neutral-300 min-w-72 h-[38.5px] rounded px-3 flex items-center">{gstAmount}</p>
        </div>
        <div className="max-w-72 gap-2 flex flex-col">
          <label htmlFor="">Total Payable Amount</label>
          <input
            type="number"
            name="in_iTotal_Payable_Amount"
            placeholder="Total Payable Amount"
            value={formData.in_iTotal_Payable_Amount}
            className="border border-neutral-300 min-w-72 h-[38.5px] rounded px-3 hidden"
          />
          <p className="border border-neutral-300 min-w-72 h-[38.5px] rounded px-3 flex items-center">
            {totalPayableAmount}
          </p>
        </div>
        <div className="max-w-72 gap-2 flex flex-col">
          <label htmlFor="">Total Paid Amount</label>
          <input
            type="number"
            name="in_iTotal_Paid_Amount"
            placeholder="Total Paid Amount"
            value={formData.in_iTotal_Paid_Amount}
            onChange={handleInputChange}
            className="border border-neutral-300 min-w-72 h-[38.5px] rounded px-3"
          />
        </div>
        <div className="max-w-72 gap-2 flex flex-col">
          <label htmlFor="">Received By</label>
          <input
            type="text"
            name="in_iRecived_by"
            placeholder="Received By"
            value={formData.in_iRecived_by}
            onChange={handleInputChange}
            className="border border-neutral-300 text-gray-500 min-w-72 h-[38.5px] rounded px-3 "
            disabled
          />
        </div>
      </div>

      <div
        id="material-container"
        className="w-full flex flex-col gap-4 border"
      >
        {materialForms.map((_, index) => (
          <div
            className="flex flex-col gap-4 p-8 bg-white rounded shadow-md"
            key={index}
          >
            <div key={index} className="flex flex-wrap gap-5">
              <div className="flex flex-col gap-2 min-w-72">
                <label htmlFor="">Material Name</label>
                <CreatableSelect
                  options={materialName.map((name) => ({
                    label: name,
                    value: name,
                  }))}
                  value={
                    material[index]?.inm_vMaterial_Name
                      ? {
                          label: material[index].inm_vMaterial_Name,
                          value: material[index].inm_vMaterial_Name,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setSelectedMaterialName(selectedOption.value);
                    handleMaterialChange(index, {
                      target: {
                        name: "inm_vMaterial_Name",
                        value: selectedOption.value,
                      },
                    });
                  }}
                  className="min-w-72"
                />
              </div>
              <div className="flex flex-col gap-2 min-w-72">
                <label htmlFor="">Material Size</label>
                <CreatableSelect
                  options={materialSize.map((size) => ({
                    label: size,
                    value: size,
                  }))}
                  value={
                    material[index]?.inm_iMaterial_Size
                      ? {
                          label: material[index].inm_iMaterial_Size,
                          value: material[index].inm_iMaterial_Size,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    handleMaterialChange(index, {
                      target: {
                        name: "inm_iMaterial_Size",
                        value: selectedOption.value,
                      },
                    });
                  }}
                  className="min-w-72"
                />
              </div>
              <div className="flex flex-col gap-2 max-w-72">
                <label htmlFor="">Total Purchase Units</label>
                <input
                  type="number"
                  name="inm_iTotal_Purchase_Units"
                  placeholder="Total Purchase Units"
                  value={material[index]?.inm_iTotal_Purchase_Units}
                  onChange={(e) => handleMaterialChange(index, e)}
                  className="border min-w-72 h-[38.5px] rounded px-3 border-neutral-300"
                />
              </div>
              {/* <div className="flex flex-col gap-2 max-w-72">
                <label htmlFor="">Total Purchase Units</label>
                <input
                  type="number"
                  name="inm_iTotal_Purchase_Units"
                  placeholder="Total Purchase Units"
                  value={material[index]?.inm_iTotal_Purchase_Units}
                  onChange={(e) => handleMaterialChange(index, e)}
                  className="border min-w-72 h-[38.5px] rounded px-3 border-neutral-300"
                />
              </div> */}
              <div className="flex flex-col gap-2 max-w-72">
                <label htmlFor="">Total Material Amount</label>
                <input
                  type="number"
                  name="inm_iTotal_Material_Amount"
                  placeholder="Total Material Amount"
                  value={material[index]?.inm_iTotal_Material_Amount}
                  onChange={(e) => handleMaterialChange(index, e)}
                  className="border min-w-72 h-[38.5px] rounded px-3 border-neutral-300"
                />
              </div>
              <div className="flex flex-col gap-2 max-w-72">
                <label htmlFor="">Unit Amount</label>
                <input
                  type="number"
                  name="inm_iUnit_Amount"
                  placeholder="Unit Amount"
                  value={material[index]?.inm_iUnit_Amount}
                  onChange={(e) => handleMaterialChange(index, e)}
                  className="border min-w-72 h-[38.5px] rounded px-3 border-neutral-300"
                />
              </div>
              <div className="flex flex-col gap-2 max-w-72">
                <label htmlFor="">Discount Percentage</label>
                <input
                  type="number"
                  name="inm_iDiscount_Percentage"
                  placeholder="Discount Percentage"
                  value={material[index]?.inm_iDiscount_Percentage}
                  onChange={(e) => handleMaterialChange(index, e)}
                  className="border min-w-72 h-[38.5px] rounded px-3 border-neutral-300"
                />
              </div>
              <div className="flex flex-col gap-2 max-w-72">
                <label htmlFor="">Discount Amount</label>
                <input
                  type="number"
                  name="inm_iDiscount_Amount"
                  placeholder="Discount Amount"
                  value={material[index]?.inm_iDiscount_Amount}
                  onChange={(e) => handleMaterialChange(index, e)}
                  className="border min-w-72 h-[38.5px] rounded px-3 border-neutral-300"
                />
              </div>
              <div className="flex flex-col gap-2 max-w-72">
                <label htmlFor="">GST Percentage</label>
                <input
                  type="number"
                  name="inm_iGST_Percentage"
                  placeholder="GST Percentage"
                  value={material[index]?.inm_iGST_Percentage}
                  onChange={(e) => handleMaterialChange(index, e)}
                  className="border min-w-72 h-[38.5px] rounded px-3 border-neutral-300"
                />
              </div>
              <div className="flex flex-col gap-2 max-w-72">
                <label htmlFor="">GST Amount</label>
                <input
                  type="number"
                  name="inm_iGST_Amount"
                  placeholder="GST Amount"
                  value={material[index]?.inm_iGST_Amount}
                  onChange={(e) => handleMaterialChange(index, e)}
                  className="border min-w-72 h-[38.5px] rounded px-3 border-neutral-300"
                />
              </div>
              <div className="flex flex-col gap-2 max-w-72">
                <label htmlFor="">Total Payable Amount</label>
                <input
                  type="number"
                  name="inm_iTotal_Payable_Amount"
                  placeholder="Total Payable Amount"
                  value={material[index]?.inm_iTotal_Payable_Amount}
                  onChange={(e) => handleMaterialChange(index, e)}
                  className="border min-w-72 h-[38.5px] rounded px-3 border-neutral-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleAddMaterial}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Material
        </button>
        <button
          onClick={createPurchase}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Back
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Material Name</th>
              <th className="px-4 py-2 border">Material Quantity</th>
              <th className="px-4 py-2 border">Unit Amount</th>
              <th className="px-4 py-2 border">Discount Percentage</th>
              <th className="px-4 py-2 border">Discount Amount</th>
              <th className="px-4 py-2 border">GST</th>
              <th className="px-4 py-2 border">GST Amount</th>
              <th className="px-4 py-2 border">Total Payable Amount</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {submittedMaterials.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{item.inm_vMaterial_Name}</td>
                <td className="px-4 py-2 border">
                  {item.inm_iTotal_Purchase_Units}
                </td>
                <td className="px-4 py-2 border">{item.inm_iUnit_Amount}</td>
                <td className="px-4 py-2 border">
                  {item.inm_iDiscount_Percentage}
                </td>
                <td className="px-4 py-2 border">
                  {item.inm_iDiscount_Amount}
                </td>
                <td className="px-4 py-2 border">{item.inm_iGST_Percentage}</td>
                <td className="px-4 py-2 border">{item.inm_iGST_Amount}</td>
                <td className="px-4 py-2 border">
                  {item.inm_iTotal_Payable_Amount}
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteMaterial(index)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditMaterial(index)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PurchaseCreate;
