 import React, { useState, useEffect } from 'react'
 import { useParams } from 'react-router-dom'
 import AxiosInstance from '../../../utilities/AxiosInstance'
 import { message } from 'antd'
 
 function ReturnBills() {
   const { id } = useParams()
   const [formData, setFormData] = useState({
     br_vPatient_Id: id,
     br_vClinicID: JSON.parse(sessionStorage.getItem('user'))?.u_vClinicId,
     br_vDateTime: new Date().toISOString(),
     br_iTotal_Return_Amount: 0,
     materials: []
   })
 
   const [material, setMaterial] = useState({
     brm_vSupplier_Name: '',
     brm_vCompany_Name: '',
     brm_vMaterial_Name: '',
     brm_iMaterial_Size: '',
     brm_iUnit_Amount: 0,
     brm_iSeal_Units: 0,
     brm_iReturn_Units: 0,
     brm_iTotal_Return_Amount: 0
   })
 
   const [patientBillMaterials, setPatientBillMaterials] = useState([])
   const [supplierOptions, setSupplierOptions] = useState([])
   const [companyOptions, setCompanyOptions] = useState([])
   const [materialOptions, setMaterialOptions] = useState([])
 
   useEffect(() => {
     const fetchPatientBillMaterials = async () => {
       try {
         const response = await AxiosInstance.get(`/inventorybill/getpatiend-billmaterial/${id}`)
         console.log(response.data.response)
         const materials = Array.isArray(response.data.response) ? response.data.response : []
         setPatientBillMaterials(materials)
         
         // Get unique companies first
         const uniqueCompanies = [...new Set(materials.map(item => item.bim_vCompany_Name))]
         setCompanyOptions(uniqueCompanies)
       } catch (error) {
         console.error('Error fetching patient bill materials:', error)
         message.error('Error fetching patient bill materials')
       }
     }
 
     fetchPatientBillMaterials()
   }, [id])
 
   useEffect(() => {
     // Update material options when company changes
     if (!Array.isArray(patientBillMaterials)) {
       setMaterialOptions([])
       return
     }
 
     const filteredMaterials = patientBillMaterials
       .filter(item => item.bim_vCompany_Name === material.brm_vCompany_Name)
       .map(item => ({
         name: item.bim_vMaterial_name,
         sizes: [item.bim_vMaterial_Size], // Create array with single size
         unitAmount: item.bim_iUnit_Amount,
         count: item.bim_iMaterial_Count,
         supplier: item.bim_vSupplier_Name
       }))
     
     // Group by material name and combine sizes
     const groupedMaterials = filteredMaterials.reduce((acc, curr) => {
       const existing = acc.find(item => item.name === curr.name)
       if (existing) {
         // Add size if not already present
         if (!existing.sizes.includes(curr.sizes[0])) {
           existing.sizes.push(curr.sizes[0])
         }
       } else {
         acc.push(curr)
       }
       return acc
     }, [])
     
     setMaterialOptions(groupedMaterials)
     
     // Clear material selection when company changes
     setMaterial(prev => ({
       ...prev,
       brm_vMaterial_Name: '',
       brm_iMaterial_Size: '',
       brm_iUnit_Amount: 0,
       brm_iSeal_Units: 0,
       brm_vSupplier_Name: ''
     }))
   }, [material.brm_vCompany_Name, patientBillMaterials])
 
   useEffect(() => {
     // Update supplier options and material details when material changes
     if (!Array.isArray(patientBillMaterials)) {
       setSupplierOptions([])
       return
     }
 
     const filteredSuppliers = patientBillMaterials.filter(item => 
       item.bim_vCompany_Name === material.brm_vCompany_Name &&
       item.bim_vMaterial_name === material.brm_vMaterial_Name
     ).map(item => item.bim_vSupplier_Name)
     
     setSupplierOptions([...new Set(filteredSuppliers)])
     
     // Auto-fill material details when material changes
     if (material.brm_vMaterial_Name) {
       const selectedMaterial = patientBillMaterials.find(m => 
         m.bim_vMaterial_name === material.brm_vMaterial_Name &&
         m.bim_vMaterial_Size === material.brm_iMaterial_Size
       )
       if (selectedMaterial) {
         setMaterial(prev => ({
           ...prev,
           brm_iUnit_Amount: selectedMaterial.bim_iUnit_Amount,
           brm_iSeal_Units: selectedMaterial.bim_iMaterial_Count
         }))
       }
     }
   }, [material.brm_vMaterial_Name, material.brm_iMaterial_Size, material.brm_vCompany_Name, patientBillMaterials])
 
   const handleMaterialChange = (e) => {
     const { name, value } = e.target
     setMaterial(prev => {
       const updatedMaterial = {
         ...prev,
         [name]: value
       }
       
       // Recalculate total return amount
       if (name === 'brm_iUnit_Amount' || name === 'brm_iReturn_Units') {
         updatedMaterial.brm_iTotal_Return_Amount = 
           Number(updatedMaterial.brm_iUnit_Amount) * Number(updatedMaterial.brm_iReturn_Units)
       }
       
       return updatedMaterial
     })
   }
 
   const handleAddMaterial = () => {
     if (!material.brm_vSupplier_Name || !material.brm_vMaterial_Name || !material.brm_iReturn_Units) {
       message.error('Please fill in all required fields')
       return
     }
 
     setFormData(prev => {
       const updatedMaterials = [...prev.materials, material]
       const totalReturnAmount = updatedMaterials.reduce((sum, item) => sum + item.brm_iTotal_Return_Amount, 0)
       
       return {
         ...prev,
         materials: updatedMaterials,
         br_iTotal_Return_Amount: totalReturnAmount
       }
     })
 
     // Reset material form
     setMaterial({
       brm_vSupplier_Name: '',
       brm_vCompany_Name: '',
       brm_vMaterial_Name: '',
       brm_iMaterial_Size: '',
       brm_iUnit_Amount: 0,
       brm_iSeal_Units: 0,
       brm_iReturn_Units: 0,
       brm_iTotal_Return_Amount: 0
     })
   }
 
   const handleEdit = (index) => {
     const materialToEdit = formData.materials[index]
     setMaterial(materialToEdit)
     
     // Remove the material from the list
     setFormData(prev => {
       const updatedMaterials = prev.materials.filter((_, i) => i !== index)
       const totalReturnAmount = updatedMaterials.reduce((sum, item) => sum + item.brm_iTotal_Return_Amount, 0)
       
       return {
         ...prev,
         materials: updatedMaterials,
         br_iTotal_Return_Amount: totalReturnAmount
       }
     })
   }
 
   const handleDelete = (index) => {
     setFormData(prev => {
       const updatedMaterials = prev.materials.filter((_, i) => i !== index)
       const totalReturnAmount = updatedMaterials.reduce((sum, item) => sum + item.brm_iTotal_Return_Amount, 0)
       
       return {
         ...prev,
         materials: updatedMaterials,
         br_iTotal_Return_Amount: totalReturnAmount
       }
     })
   }
 
   const handleSubmit = async (e) => {
     e.preventDefault()
     console.log(formData,"formData")     
     if (formData.materials.length === 0) {
       message.error('Please add at least one material')
       return
     }
 
     try {
       await AxiosInstance.post('/returnbill/add-inventorybillreturn', formData)
       message.success('Return bill created successfully')
       // Reset form
       setFormData({
         br_vPatient_Id: id,
         br_vClinicID: JSON.parse(sessionStorage.getItem('user'))?.u_vClinicId,
         br_vDateTime: new Date().toISOString(),
         br_iTotal_Return_Amount: 0,
         materials: []
       })
     } catch (error) {
       console.error('Error creating return bill:', error)
       message.error('Error creating return bill')
     }
   }
 
   return (
     <div className="p-4">
       <h2 className="text-2xl font-bold mb-4">Return Bills</h2>
       <form onSubmit={handleSubmit} className="space-y-4">
         <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
             <select
               name="brm_vCompany_Name"
               value={material.brm_vCompany_Name}
               onChange={handleMaterialChange}
               className="p-2 border rounded w-full"
             >
               <option value="">Select Company</option>
               {companyOptions.map(company => (
                 <option key={company} value={company}>{company}</option>
               ))}
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Material Name *</label>
             <select
               name="brm_vMaterial_Name"
               value={material.brm_vMaterial_Name}
               onChange={handleMaterialChange}
               className="p-2 border rounded w-full"
               disabled={!material.brm_vCompany_Name}
             >
               <option value="">Select Material</option>
               {materialOptions.map(material => (
                 <option key={material.name} value={material.name}>{material.name}</option>
               ))}
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
             <select
               name="brm_vSupplier_Name"
               value={material.brm_vSupplier_Name}
               onChange={handleMaterialChange}
               className="p-2 border rounded w-full"
               disabled={!material.brm_vMaterial_Name}
             >
               <option value="">Select Supplier</option>
               {supplierOptions.map(supplier => (
                 <option key={supplier} value={supplier}>{supplier}</option>
               ))}
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Material Size</label>
             <select
               name="brm_iMaterial_Size"
               value={material.brm_iMaterial_Size}
               onChange={handleMaterialChange}
               className="p-2 border rounded w-full"
               disabled={!material.brm_vMaterial_Name}
             >
               <option value="">Select Size</option>
               {materialOptions
                 .find(m => m.name === material.brm_vMaterial_Name)?.sizes
                 .map(size => (
                   <option key={size} value={size}>{size}</option>
                 ))
               }
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Unit Amount *</label>
             <input
               type="number"
               name="brm_iUnit_Amount"
               value={material.brm_iUnit_Amount}
               readOnly
               className="p-2 border rounded w-full bg-gray-100"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Seal Units *</label>
             <input
               type="number"
               name="brm_iSeal_Units"
               value={material.brm_iSeal_Units}
               readOnly
               className="p-2 border rounded w-full bg-gray-100"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Return Units *</label>
             <input
               type="number"
               name="brm_iReturn_Units"
               value={material.brm_iReturn_Units}
               onChange={handleMaterialChange}
               placeholder="Enter return units"
               className="p-2 border rounded w-full"
               min="0"
               max={material.brm_iSeal_Units}
             />
           </div>
         </div>
 
         <button
           type="button"
           onClick={handleAddMaterial}
           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
         >
           Add Material
         </button>
 
         <div className="mt-4">
           <h3 className="text-xl font-bold">Materials List</h3>
           <div className="overflow-x-auto">
             {formData.materials.length > 0 ? (
               <table className="min-w-full table-auto border-collapse mt-2">
                 <thead>
                   <tr className="bg-gray-100">
                     <th className="border px-4 py-2">Supplier Name</th>
                     <th className="border px-4 py-2">Company Name</th>
                     <th className="border px-4 py-2">Material</th>
                     <th className="border px-4 py-2">Size</th>
                     <th className="border px-4 py-2">Unit Amount</th>
                     <th className="border px-4 py-2">Seal Units</th>
                     <th className="border px-4 py-2">Return Units</th>
                     <th className="border px-4 py-2">Return Amount</th>
                     <th className="border px-4 py-2">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {formData.materials.map((item, index) => (
                     <tr key={index}>
                       <td className="border px-4 py-2">{item.brm_vSupplier_Name}</td>
                       <td className="border px-4 py-2">{item.brm_vCompany_Name}</td>
                       <td className="border px-4 py-2">{item.brm_vMaterial_Name}</td>
                       <td className="border px-4 py-2">{item.brm_iMaterial_Size}</td>
                       <td className="border px-4 py-2">₹{item.brm_iUnit_Amount}</td>
                       <td className="border px-4 py-2">{item.brm_iSeal_Units}</td>
                       <td className="border px-4 py-2">{item.brm_iReturn_Units}</td>
                       <td className="border px-4 py-2">₹{item.brm_iTotal_Return_Amount}</td>
                       <td className="border px-4 py-2">
                         <div className="flex gap-2 justify-center">
                           <button
                             type="button"
                             onClick={() => handleEdit(index)}
                             className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                           >
                             Edit
                           </button>
                           <button
                             type="button"
                             onClick={() => handleDelete(index)}
                             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                           >
                             Delete
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             ) : (
               <div className="text-center py-4 text-gray-500">
                 No materials added yet
               </div>
             )}
           </div>
         </div>
 
         <div className="mt-4">
           <p className="text-xl">Total Return Amount: ₹{formData.br_iTotal_Return_Amount}</p>
         </div>
 
         <button
           type="submit"
           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
         >
           Submit Return Bill
         </button>
       </form>
     </div>
   )
 }
 
 export default ReturnBills